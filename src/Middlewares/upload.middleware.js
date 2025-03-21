import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png/;
  const isFileTypeValid = allowedTypes.test(file.mimetype);

  if (isFileTypeValid) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'), false);
  }
};

const uploadProfileImage = (req, res, next) => {
  const upload = multer({ storage, fileFilter }).single('profileImage');

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

export { uploadProfileImage };
