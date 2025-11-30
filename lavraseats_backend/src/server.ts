import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { routes } from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/imgs', express.static(path.resolve(process.cwd(), 'uploads')));

app.use('/api', routes); 

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Node rodando na porta ${PORT}`);
});