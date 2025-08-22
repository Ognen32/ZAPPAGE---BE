import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadAvatar = multer({ storage }).single('image');
export const uploadTwoCovers = multer({ storage }).array('covers', 2);