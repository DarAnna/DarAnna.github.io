// Import all photos 
const importAll = (r: any) => {
  const images: Record<string, string> = {};
  r.keys().forEach((item: string) => {
    const key = item.replace('./', '');
    images[key] = r(item);
  });
  return images;
};

// We'll use this in place of require() for photos
export const getImagePath = (filename: string): string => {
  try {
    // Add the full URL structure with proper path and cache-busting query parameter
    return `${process.env.PUBLIC_URL}/photos/${filename}?t=${Date.now()}`;
  } catch (err) {
    console.error(`Error loading image: ${filename}`, err);
    return '';
  }
}; 