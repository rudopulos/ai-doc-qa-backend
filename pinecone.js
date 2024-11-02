const { Pinecone } = require('@pinecone-database/pinecone');

const pinecone = new Pinecone();

const initPinecone = async () => {
    await pinecone.init({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENVIRONMENT,
    });
};

module.exports = { pinecone, initPinecone };
