const { ImageKit } = require("@imagekit/nodejs");

const imageKit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(filePath, fileName) {
  try {
    const fs = require("fs");

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Use stream instead of buffer to handle large files
    const fileStream = fs.createReadStream(filePath);

    console.log(`Uploading file: ${fileName}`);
    console.log(`File path: ${filePath}`);

    const result = await imageKit.files.upload({
      file: fileStream,
      fileName: fileName || `file_${Date.now()}`,
      folder: "/music",
    });

    return result;
  } catch (error) {
    console.log("ImageKit Upload Error:", error);
    throw error;
  }
}

module.exports = { uploadFile };
