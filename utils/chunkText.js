function chunkText(text, chunkSize) {
    const words = text.split(' ');
    const chunks = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks;
  }
  
  module.exports = { chunkText };
  