import ftp from "basic-ftp";
import streamifier from "streamifier";

export async function uploadToFTP(buffer, filename) {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: "ftp.preprodagency.com",
      user: "u979999149.hygimar",
      password: "Hygimar@000",
      secure: false,
    });

    const uploadDir = "/";
    await client.ensureDir(uploadDir);

    const stream = streamifier.createReadStream(buffer);
    await client.uploadFrom(stream, `${uploadDir}/${filename}`);
  } catch (err) {
    console.error("FTP Upload Error:", err);
    throw err;
  } finally {
    client.close();
  }
}
