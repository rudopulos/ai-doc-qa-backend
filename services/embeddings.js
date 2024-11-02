const axios = require('axios');

async function getEmbedding(text) {
  const response = await axios.post('https://api.openai.com/v1/embeddings', {
    model: 'text-embedding-ada-002',
    input: text
  }, {
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
  });
  return response.data.data[0].embedding;
}

module.exports = { getEmbedding };
