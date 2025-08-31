import fs from 'fs';

export const removeComicFromStorage = function (mainCover, coverArt, zip) {
    fs.unlinkSync(mainCover.path);
    fs.unlinkSync(coverArt.path);
    fs.unlinkSync(zip.path);
}