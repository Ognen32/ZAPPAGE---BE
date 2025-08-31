import AdmZip from 'adm-zip';
import path from 'path';

export const pageCounter = (zip_dest) => {
    const ext = path.extname(zip_dest).toLowerCase();

    if (ext !== '.zip' && ext !== '.cbz') {
  throw new Error('Only ZIP or CBZ files are supported.');
}
    let counter = 0;
    const zip = new AdmZip(zip_dest);
    const zipEntries = zip.getEntries(); // Add 'const' here

    zipEntries.forEach((zipEntry) => {
        if (path.extname(zipEntry.entryName).toLowerCase() !== ".xml") {
            counter++;
        }
    });

    return counter;
};
