import multer from 'multer';
import cripto from 'crypto';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const assetsFolder = path.resolve(__dirname, '..', '..', 'tmp', 'images');

export default {
  tmpFolder,
  assetsFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = cripto.randomBytes(10).toString('hex');
      const filename = `${fileHash}-${file.originalname}`;
      return callback(null, filename);
    },
  }),
};
