const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { pinecone, initPinecone } = require('./pinecone'); 
const { chunkText } = require('./utils/chunkText');
const { generateId } = require('./utils/generateId');
const { getEmbedding } = require('./services/embeddings');
require('dotenv').config();

console.log("PINECONE_API_KEY:", process.env.PINECONE_API_KEY);
console.log("PINECONE_ENVIRONMENT:", process.env.PINECONE_ENVIRONMENT);
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

const app = express();
const upload = multer();
const PORT = process.env.PORT || 5000;

app.use(express.json());


app.post('/upload', upload.single('document'), async (req, res) => {
    console.log("Request primit la /upload");
    try {
        const file = req.file;
        console.log("Fișier încărcat:", file);
        if (!file) return res.status(400).send('No file uploaded.');

        let text = '';
        if (file.mimetype === 'application/pdf') {
            const pdfData = await pdfParse(file.buffer);
            text = pdfData.text;
        } else {
            text = file.buffer.toString();
            console.log("Text extras din fișier:", text);
        }

   
        const chunks = chunkText(text, 500);  
        console.log("Chunk-uri generate:", chunks);

        const embeddings = await Promise.all(chunks.map(async (chunk) => {
            const embedding = await getEmbedding(chunk);
            console.log("Embedding generat pentru chunk:", chunk, embedding);
            return { chunk, embedding };
        }));

        console.log("Embeddings pentru salvare în Pinecone:", embeddings.map(e => ({
            id: generateId(),
            values: e.embedding,
            metadata: { text: e.chunk }
        })));
        await pinecone.index({
            index: 'document-embeddings',
            vectors: embeddings.map(e => ({
                id: generateId(),
                values: e.embedding,
                metadata: { text: e.chunk }
            }))
        });

        res.send({ message: 'Document processed and stored.' });
    } catch (err) {
        console.error(err);
        console.error("Eroare în procesarea documentului:", err);
        res.status(500).send({ error: 'Failed to process document.' });
    }
});


const startServer = async () => {
    await initPinecone();
    console.log("Cheie Pinecone API:", process.env.PINECONE_API_KEY);
    console.log("Mediu Pinecone:", process.env.PINECONE_ENVIRONMENT); 
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer().catch(err => {
    console.error('Error starting server:', err);
});
