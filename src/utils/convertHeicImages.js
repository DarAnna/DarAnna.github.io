const fs = require('fs');
const path = require('path');
const util = require('util');
const heicConvert = require('heic-convert');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const photosDir = path.join(__dirname, '../../public/photos');

async function convertHeicToJpg(filePath) {
  try {
    const fileName = path.basename(filePath);
    const newFileName = fileName.replace(/\.HEIC$/i, '.jpg');
    const newFilePath = path.join(photosDir, newFileName);
    
    // Read the HEIC file
    const inputBuffer = await readFile(filePath);
    
    // Convert to JPEG
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.9
    });
    
    // Write the JPEG file
    await writeFile(newFilePath, outputBuffer);
    
    console.log(`Converted ${fileName} to ${newFileName}`);
    return newFileName;
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error);
    return null;
  }
}

async function processAllHeicFiles() {
  try {
    // Get all HEIC files
    const files = fs.readdirSync(photosDir)
      .filter(file => file.toLowerCase().endsWith('.heic'))
      .map(file => path.join(photosDir, file));
    
    console.log(`Found ${files.length} HEIC files to convert`);
    
    // Convert each file
    const conversions = files.map(file => convertHeicToJpg(file));
    const results = await Promise.all(conversions);
    
    // Update photos.ts with new filenames
    updatePhotoReferences(results);
    
    console.log('All HEIC files converted successfully');
  } catch (error) {
    console.error('Error processing HEIC files:', error);
  }
}

function updatePhotoReferences(newFileNames) {
  // Read the photos.ts file
  const photosFilePath = path.join(__dirname, '../utils/photos.ts');
  const photosContent = fs.readFileSync(photosFilePath, 'utf-8');
  
  // Create a new content with updated filenames
  let updatedContent = photosContent;
  
  newFileNames.forEach(newFileName => {
    if (!newFileName) return;
    
    // Get the original filename
    const originalFileName = newFileName.replace('.jpg', '.HEIC');
    
    // Replace all occurrences of the original filename with the new filename
    const regex = new RegExp(originalFileName, 'g');
    updatedContent = updatedContent.replace(regex, newFileName);
  });
  
  // Write the updated content back to the file
  fs.writeFileSync(photosFilePath, updatedContent);
  console.log('Updated photo references in photos.ts');
}

// Run the conversion
processAllHeicFiles(); 