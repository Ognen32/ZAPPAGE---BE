import AdmZip from 'adm-zip';
import path from 'path';
import sharp from 'sharp';
import slugify from 'slugify';
import cloudinary from '../config/cloudinarySetup.js';
import { createComicPage } from '../repositories/comicPageRepository.js';

export const comicPagesUploader = async ({ comicId, comicTitle, zipFilePath }) => {
  const zip = new AdmZip(zipFilePath);

  // Filter entries to images only and sort ascending by filename
  const zipEntries = zip.getEntries()
    .filter(entry => {
      const ext = path.extname(entry.entryName).toLowerCase();
      return !entry.isDirectory && ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    })
    .sort((a, b) => a.entryName.localeCompare(b.entryName)); // Ascending alphabetical sort

  const slug = slugify(comicTitle, { lower: true, strict: true });

  let pageNumber = 1; // Start page numbering at 1

  for (const entry of zipEntries) {
    try {
      const ext = path.extname(entry.entryName).toLowerCase().replace('.', ''); // e.g. 'jpg', 'png'
      const imageBuffer = entry.getData();

      // Compress image with sharp, keep original format, reduce quality ~50%
      const compressedBuffer = await sharp(imageBuffer)
        .toFormat(ext, { quality: 50 })
        .toBuffer();

      // Upload to Cloudinary WITHOUT extra quality/fetch_format params (upload as is)
      const pageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `Comics/${slug}/pages`,
            public_id: `page-${pageNumber.toString().padStart(2, '0')}`, // page-01, page-02, etc.
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );

        stream.end(compressedBuffer);
      });

      // Save page info to DB
      await createComicPage(comicId, pageNumber, pageUrl);
      console.log(`✅ Uploaded and saved page ${pageNumber} (${entry.entryName})`);

      pageNumber++; // Increment page number for next image
    } catch (err) {
      console.error(`❌ Failed to upload ${entry.entryName}: ${err.message}`);
      throw new Error(`Upload failed for ${entry.entryName}`);
    }
  }
};
