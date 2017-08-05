/* eslint "import/no-extraneous-dependencies": "off" */
/* eslint "no-console": "off" */

// require modules 
const fs = require('fs');
const archiver = require('archiver');

// create a file to stream archive data to. 
const output = fs.createWriteStream(`${__dirname}/bundle.zip`);
const archive = archiver('zip', {
  zlib: { level: 9 }, // Sets the compression level. 
});

// listen for all archive data to be written 
output.on('close', () => {
  console.log(`${archive.pointer()} total bytes`);
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

// good practice to catch warnings (ie stat failures and other non-blocking errors) 
archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    // log warning 
  } else {
    // throw error 
    throw err;
  }
});

// good practice to catch this error explicitly 
archive.on('error', (err) => {
  throw err;
});

// pipe archive data to the file 
archive.pipe(output);

archive.file(`${__dirname}/index.js`, { name: 'index.js' });
archive.file(`${__dirname}/package.json`, { name: 'package.json' });

// finalize the archive (ie we are done appending files but streams have to finish yet) 
archive.finalize();
