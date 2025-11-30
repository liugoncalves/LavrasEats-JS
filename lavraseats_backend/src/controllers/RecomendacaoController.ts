import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { gerarRecomendacaoIA } from '../utils/gemini';

export class RecomendacaoController {
    async gerar(req: Request, res: Response) {
        const { categoria, prompt } = req.body;

        const restaurantes = await prisma.restaurante.findMany({
            where: { categoria: { contains: categoria, mode: 'insensitive' } }
        });

        if (restaurantes.length === 0) return res.status(404).json({ erro: 'Nenhum restaurante nesta categoria.' });

        const ids = restaurantes.map(r => r.id);
        const avaliacoes = await prisma.avaliacao.findMany({
            where: { restaurante_id: { in: ids } }
        });

        const resultado = await gerarRecomendacaoIA(prompt, restaurantes, avaliacoes);

        if (resultado && resultado.id_restaurante_recomendado) {
            const r = await prisma.restaurante.findUnique({ where: { id: resultado.id_restaurante_recomendado } });
            
            const imagemUrl = r?.poster ? `http://localhost:8000/imgs/posters/${r.poster}` : null;

            return res.json({
                restaurante_id: r?.id,
                mensagem_explicativa: resultado.mensagem_explicativa,
                nome: r?.nome,
                imagem_url: imagemUrl
            });
        }

        return res.status(200).json({ 
            restaurante_id: null, 
            mensagem_explicativa: resultado?.mensagem_explicativa || "Não encontrei nada." 
        });
    }
}