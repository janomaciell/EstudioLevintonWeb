/**
 * upload-to-r2.js
 * ────────────────────────────────────────────────────────────
 * Sube TODAS las imágenes de /public/img a Cloudflare R2.
 *
 * Uso:
 *   node scripts/upload-to-r2.js               # sube todo
 *   node scripts/upload-to-r2.js --dry-run     # solo lista sin subir
 *
 * Requiere .env en la raíz del proyecto con:
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *   R2_ACCOUNT_ID
 * ────────────────────────────────────────────────────────────
 */

import 'dotenv/config';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Config ───────────────────────────────────────────────
const BUCKET = 'estudio-levinton';
const LOCAL_DIR = path.resolve(__dirname, '../public/img');
const DRY_RUN = process.argv.includes('--dry-run');

const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ACCOUNT_ID } = process.env;

if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ACCOUNT_ID) {
  console.error('❌ Faltan variables de entorno R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY o R2_ACCOUNT_ID');
  console.error('   Completá el archivo .env en la raíz del proyecto.');
  process.exit(1);
}

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// ─── Content types ────────────────────────────────────────
const CONTENT_TYPES = {
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  svg:  'image/svg+xml',
  gif:  'image/gif',
  mp4:  'video/mp4',
  heic: 'image/heic',
};

function getContentType(filePath) {
  const ext = path.extname(filePath).slice(1).toLowerCase();
  return CONTENT_TYPES[ext] || 'application/octet-stream';
}

// ─── Scan files recursively ───────────────────────────────
function getAllFiles(dir, base = dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === '.DS_Store') continue;
    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, base));
    } else {
      const key = 'img/' + path.relative(base, fullPath);
      results.push({ fullPath, key });
    }
  }
  return results;
}

// ─── Check if object exists (skip duplicates) ─────────────
async function objectExists(key) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

// ─── Upload one file ──────────────────────────────────────
async function uploadFile(fullPath, key) {
  const fileContent = fs.readFileSync(fullPath);
  const contentType = getContentType(fullPath);

  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
    // Cache agresivo — las fotos no cambian
    CacheControl: 'public, max-age=31536000, immutable',
  }));
}

// ─── Main ─────────────────────────────────────────────────
async function main() {
  console.log(`\n🔍 Escaneando ${LOCAL_DIR}...\n`);

  const files = getAllFiles(LOCAL_DIR);
  console.log(`   Encontrados: ${files.length} archivos\n`);

  if (DRY_RUN) {
    console.log('🏜️  DRY RUN — no se sube nada:\n');
    files.forEach(f => console.log(`   ${f.key}`));
    console.log(`\n   Total: ${files.length} archivos`);
    return;
  }

  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const { fullPath, key } of files) {
    try {
      const exists = await objectExists(key);
      if (exists) {
        console.log(`⏭️  Ya existe: ${key}`);
        skipped++;
        continue;
      }

      await uploadFile(fullPath, key);
      uploaded++;
      const sizeMB = (fs.statSync(fullPath).size / 1024 / 1024).toFixed(2);
      console.log(`✅ Subida: ${key} (${sizeMB} MB)`);
    } catch (err) {
      errors++;
      console.error(`❌ Error: ${key} → ${err.message}`);
    }
  }

  console.log(`\n────────────────────────────────────────`);
  console.log(`✅ Subidas: ${uploaded}`);
  console.log(`⏭️  Omitidas: ${skipped}`);
  if (errors) console.log(`❌ Errores: ${errors}`);
  console.log(`────────────────────────────────────────\n`);
}

main();
