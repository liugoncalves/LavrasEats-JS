import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadFolder = path.resolve(process.cwd(), 'uploads', 'posters');

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

export const uploadConfig = {
  directory: uploadFolder,
  storage: multer.diskStorage({
    destination: uploadFolder,
    filename(request: any, file: any, callback: any) {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
      const fileName = `${Date.now()}-${safeName}`;
      return callback(null, fileName);
    },
  }),
};