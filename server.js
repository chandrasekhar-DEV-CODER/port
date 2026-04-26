import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authHandler from './api/auth.js';
import portfolioHandler from './api/portfolio.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Allow robust base64 image strings

app.all('/api/auth', async (req, res) => {
    try {
        await authHandler(req, res);
    } catch (err) {
        if (!res.headersSent) res.status(500).json({ error: err.message });
    }
});

app.all('/api/portfolio', async (req, res) => {
    try {
        await portfolioHandler(req, res);
    } catch (err) {
        if (!res.headersSent) res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Local Express API Server running on port ${PORT}`);
});
