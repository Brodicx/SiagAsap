import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";

// Import Routes
import ispuRoutes from './routes/ispuRoutes.mjs';
import reportRoutes from './routes/reportRoutes.mjs';
import newsRoutes from './routes/newsRoutes.mjs';
import poskoRoutes from './routes/poskoRoutes.mjs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Registrasi Route API
app.use('/api/ispu', ispuRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/posko', poskoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server SiagAsap running di http://localhost:${PORT}`);
});