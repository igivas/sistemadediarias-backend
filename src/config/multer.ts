import { FileFilterCallback } from 'multer';

const MAX_SIZE_THEN_MEGABYTES = 10 * 1024 * 1024;
const MAX_SIZE_ONE_MEGABYTES = 1 * 1024 * 1024;

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
//   },
//   filename(req, file, cb) {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     cb(null, `${uniqueSuffix}.pdf`);
//   },
// });

export default {
  pdf: {
    limits: {
      fileSize: MAX_SIZE_THEN_MEGABYTES,
    },
    fileFilter: (
      req: any,
      file: Express.Multer.File,
      cb: FileFilterCallback,
    ): any => {
      const allowedMimes = ['application/pdf'];

      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type.'));
      }
    },
  },
  foto: {
    limits: {
      fileSize: MAX_SIZE_ONE_MEGABYTES,
    },
    fileFilter: (
      req: any,
      file: Express.Multer.File,
      cb: FileFilterCallback,
    ): any => {
      const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];

      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type.'));
      }
    },
  },
  // dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  // storage,
};
