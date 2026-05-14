import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import convert from 'heic-convert';

// Configuración para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMG_DIR = path.join(__dirname, 'public/img/Obras-estudio-Levinton');

async function scanAndConvert(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await scanAndConvert(fullPath);
    } else if (file.toLowerCase().endsWith('.heic')) {
      console.log(`\n🔄 Procesando: ${file}...`);
      
      try {
        const inputBuffer = fs.readFileSync(fullPath);
        const outputBuffer = await convert({
          buffer: inputBuffer,
          format: 'JPEG',
          quality: 0.9
        });

        const newPath = fullPath.replace(/\.[^/.]+$/, ".jpg");
        fs.writeFileSync(newPath, outputBuffer);
        
        console.log(`✅ Guardado como: ${path.basename(newPath)}`);

        // Borra el HEIC original
        fs.unlinkSync(fullPath);
        console.log(`🗑️  Eliminado original: ${file}`);
        
      } catch (error) {
        console.error(`❌ Error convirtiendo ${file}:`, error.message);
      }
    }
  }
}

console.log('🚀 Iniciando conversión masiva y limpieza (HEIC -> JPG)...');
scanAndConvert(IMG_DIR)
  .then(() => console.log('\n✨ ¡Proceso finalizado! Todas las imágenes son ahora JPG y las originales HEIC han sido eliminadas.'))
  .catch(err => console.error('\n❌ Error general:', err));
