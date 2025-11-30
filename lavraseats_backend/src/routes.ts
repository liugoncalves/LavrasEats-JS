import { Router } from 'express';
import multer from 'multer';
import { uploadConfig } from './config/upload';
import { UsuarioController } from './controllers/UsuarioController';
import { RestauranteController } from './controllers/RestauranteController';
import { AvaliacaoController } from './controllers/AvaliacaoController';
import { RecomendacaoController } from './controllers/RecomendacaoController';
import { authMiddleware } from './middlewares/auth';

const routes = Router();
const upload = multer(uploadConfig);

const usuarioController = new UsuarioController();
const restauranteController = new RestauranteController();
const avaliacaoController = new AvaliacaoController();
const recomendacaoController = new RecomendacaoController();

// === USUÁRIOS ===
routes.post('/usuarios/cadastrar', usuarioController.cadastrar);
routes.get('/usuarios/confirmar', usuarioController.confirmar);
routes.post('/login', usuarioController.login);
routes.get('/usuarios/me', authMiddleware, usuarioController.me);
routes.post('/token/refresh', (req, res) => res.json({ access: req.body.refresh })); 

// === RESTAURANTES ===
// [CORREÇÃO] Removidas as barras '/' do final das rotas
routes.get('/restaurantes/listar', restauranteController.listar);
routes.get('/restaurantes/consultar/:id', restauranteController.consultar);
routes.get('/restaurantes/ranking', restauranteController.ranking);
routes.get('/restaurantes/filtrar', restauranteController.filtrar);

// Rotas protegidas (Gerente)
routes.post('/restaurantes/cadastrar', authMiddleware, upload.single('poster'), restauranteController.cadastrar);
routes.put('/restaurantes/atualizar/:id', authMiddleware, upload.single('poster'), restauranteController.atualizar);
routes.delete('/restaurantes/deletar/:id', authMiddleware, restauranteController.deletar);

// === AVALIAÇÕES ===
routes.get('/avaliacoes/listar', avaliacaoController.listar);
routes.post('/avaliacoes/avaliar', authMiddleware, avaliacaoController.avaliar);
routes.get('/avaliacoes/consultar/:restauranteId', authMiddleware, avaliacaoController.consultar);
routes.get('/avaliacoes/minhas-avaliacoes', authMiddleware, avaliacaoController.minhasAvaliacoes);

// === RECOMENDAÇÕES (IA) ===
routes.post('/recomendacoes', authMiddleware, recomendacaoController.gerar);

export { routes };