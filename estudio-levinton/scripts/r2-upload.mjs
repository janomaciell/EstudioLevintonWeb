/**
 * Sube las imágenes faltantes a Cloudflare R2 via S3-compatible API
 * Uso: node scripts/r2-upload.mjs [nombre-del-bucket]
 */
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { readFileSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Cargar .env manualmente
const ENV = Object.fromEntries(
  readFileSync(join(ROOT, '.env'), 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
    .filter(([k]) => k)
);

const ACCOUNT_ID    = ENV.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = ENV.R2_ACCESS_KEY_ID;
const SECRET_KEY    = ENV.R2_SECRET_ACCESS_KEY;
const BUCKET        = process.argv[2] || 'estudio-levinton';

if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_KEY) {
  console.error('❌ Faltan credenciales en .env');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_KEY },
});

async function listBucket(prefix = 'img/portadas/') {
  console.log(`\n📦 Listando bucket "${BUCKET}" prefix "${prefix}"...\n`);
  try {
    const res = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, MaxKeys: 200 }));
    const keys = (res.Contents || []).map(o => o.Key);
    console.log(`Objetos en R2 (${keys.length}):`);
    keys.forEach(k => console.log(`  ✅ ${k}`));
    return keys;
  } catch (e) {
    console.error('❌ Error al listar bucket:', e.message);
    if (e.message.includes('NoSuchBucket') || e.message.includes('404')) {
      console.log('\n💡 El bucket no existe o el nombre es incorrecto.');
      console.log('   Pasá el nombre correcto: node scripts/r2-upload.mjs <bucket-name>');
    }
    return null;
  }
}

function getMime(ext) {
  return { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }[ext.toLowerCase()] || 'application/octet-stream';
}

async function upload(localPath, r2Key) {
  const body = readFileSync(localPath);
  const ext  = extname(localPath);
  console.log(`⬆️  ${r2Key} (${(body.length / 1024).toFixed(0)} KB)...`);
  try {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET, Key: r2Key, Body: body,
      ContentType: getMime(ext),
      CacheControl: 'public, max-age=31536000, immutable',
    }));
    console.log(`  ✅ Subido OK`);
  } catch (e) {
    console.error(`  ❌ Error: ${e.message}`);
  }
}

const MISSING = [
  'sil-328.png', 'sil-71.png', 'casa-san-isidro-labrador-laguna.png',
  'sil-202.png', 'santa-catalina-304.png', 'talar-de-pacheco.png',
  'sustentabilidad-01.png', 'reforma-sil.png',
];

async function main() {
  console.log('🚀 R2 Upload — Estudio Levinton');
  console.log(`   Bucket: ${BUCKET} | Account: ${ACCOUNT_ID}\n`);

  const existing = await listBucket('img/portadas/');
  if (existing === null) process.exit(1);

  console.log('\n⬆️  Subiendo portadas faltantes...\n');
  for (const filename of MISSING) {
    const localPath = join(ROOT, 'public', 'img', 'portadas', filename);
    const r2Key = `img/portadas/${filename}`;
    try {
      statSync(localPath);
      if (existing.includes(r2Key)) {
        console.log(`⏭️  Ya existe en R2: ${filename}`);
      } else {
        await upload(localPath, r2Key);
      }
    } catch {
      console.log(`⚠️  No existe localmente: ${filename}`);
    }
  }

  console.log('\n✅ Proceso terminado.');
  console.log('   Verifica: https://pub-0dbc19d1502d4a47a1f049597dce1ed6.r2.dev/img/portadas/sil-328.png');
}

main();
