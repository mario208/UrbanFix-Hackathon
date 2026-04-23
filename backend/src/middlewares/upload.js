import multer from 'multer';

const storage = multer.memoryStorage();

// Accept only a single file under the field name 'photo'
export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});