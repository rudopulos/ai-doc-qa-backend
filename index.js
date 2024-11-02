const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { pinecone, initPinecone } = require('./pinecone');  // Importă configurația Pinecone
const { chunkText } = require('./utils/chunkText');
const { generateId } = require('./utils/generateId');
const { getEmbedding } = require('./services/embeddings');
require('dotenv').config();

const app = express();
const upload = multer();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Endpoint pentru încărcarea documentelor
app.post('/upload', upload.single('document'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).send('No file uploaded.');

        // Extrage textul din PDF sau din fișier text simplu
        let text = '';
        if (file.mimetype === 'application/pdf') {
            const pdfData = await pdfParse(file.buffer);
            text = pdfData.text;
        } else {
            text = file.buffer.toString();
        }

        // Împarte textul în chunk-uri
        const chunks = chunkText(text, 500);  // 500 cuvinte per chunk

        // Generează embeddings pentru fiecare chunk
        const embeddings = await Promise.all(chunks.map(async (chunk) => {
            const embedding = await getEmbedding(chunk);
            return { chunk, embedding };
        }));

        // Salvează embeddings în Pinecone
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
        res.status(500).send({ error: 'Failed to process document.' });
    }
});

// Inițializează Pinecone și pornește serverul
const startServer = async () => {
    await initPinecone();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer().catch(err => {
    console.error('Error starting server:', err);
});
