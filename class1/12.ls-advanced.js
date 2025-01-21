const fs = require('node:fs/promises');
const path = require('node:path');
const pico = require('picocolors');

const folder = process.argv[2] ?? '.';

async function ls(folder) {
  let files;

  try {
    files = await fs.readdir(folder);
  } catch (error) {
    console.error(pico.red(`Error reading the directory ${folder}`));
    process.exit(1);
  }

  const filesPromises = files.map(async (file) => {
    const filePath = path.join(folder, file);
    let stats;

    try {
      stats = await fs.stat(filePath); // status - file information
    } catch {
      console.error(`Error reading the directory ${folder}`);
      process.exit(1);
    }

    const isDirectory = stats.isDirectory();
    const fileType = isDirectory ? 'd' : '-';
    const fileSize = stats.size;
    const fileModified = stats.mtime.toLocaleString();

    return `${fileType} ${pico.blue(file.padEnd(40))} ${pico.green(
      fileSize.toString().padEnd(5)
    )} ${pico.yellow(fileModified)}`;
  });

  const filesInfo = await Promise.all(filesPromises);

  filesInfo.forEach((fileInfo) => console.log(fileInfo));
}

ls(folder);
