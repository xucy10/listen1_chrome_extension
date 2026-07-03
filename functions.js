const { parseFile } = require('music-metadata');

async function readAudioTags(filePath) {
  return parseFile(filePath, { native: true });
}

module.exports = {
  readAudioTags,
};
