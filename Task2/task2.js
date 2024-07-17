const fs = require('fs');
const crypto = require('crypto');

const filesPath = './task2';
const email = 'karengonzalezdev@gmail.com';

async function calculateAndSendHashes() {
  try {
    const fileNames = fs.readdirSync(filesPath);
    const hashes = [];

    for (const fileName of fileNames) {
      const filePath = `${filesPath}/${fileName}`;
      const fileData = fs.readFileSync(filePath);

      const hash = crypto.createHash('sha3-256');
      hash.update(fileData);
      const hashHex = hash.digest('hex');

      hashes.push(hashHex);
    }

    hashes.sort();

    const concatenatedHashes = hashes.join('');
    const resultString = concatenatedHashes + email.toLowerCase();
    const finalHash = crypto.createHash('sha3-256').update(resultString).digest('hex');

    console.log(`Resultado SHA3-256 final: ${finalHash}`);

  } catch (error) {
    console.error('Ocurrió un error:', error);
  }
}

calculateAndSendHashes();