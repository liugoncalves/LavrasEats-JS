import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { analisarSentimento } from '../utils/gemini';

export class AvaliacaoController {
  async avaliar(req: Request, res: Response) {
    const { restaurante, texto } = req.body;
    const usuarioId = req.user?.id;

    if (!usuarioId) return res.status(401).json({ erro: 'Não autorizado' });

    const existe = await prisma.avaliacao.findFirst({
        where: { usuario_id: usuarioId, restaurante_id: Number(restaurante) }
    });

    if (existe) return res.status(400).json({ erro: 'Você já avaliou este restaurante' });

    const { sentimento, nota, output } = await analisarSentimento(texto);

    const avaliacao = await prisma.avaliacao.create({
        data: {
            texto, sentimento, nota,
            sentimento_texto: output,
            usuario_id: usuarioId,
            restaurante_id: Number(restaurante)
        }
    });

    const avs = await prisma.avaliacao.findMany({ where: { restaurante_id: Number(restaurante) } });
    const media = avs.reduce((acc: number, curr: any) => acc + curr.nota, 0) / avs.length;
    
    await prisma.restaurante.update({
        where: { id: Number(restaurante) },
        data: { nota_media: media, numero_avaliacoes: avs.length }
    });

    return res.status(201).json({
        ...avaliacao,
        usuario: avaliacao.usuario_id,       
        restaurante: avaliacao.restaurante_id 
    });
  }

  async listar(req: Request, res: Response) {
    const avaliacoes = await prisma.avaliacao.findMany({
        orderBy: { criado_em: 'desc' }
    });
    
    const response = avaliacoes.map((a: any) => ({
        ...a,
        usuario: a.usuario_id,
        restaurante: a.restaurante_id
    }));

    return res.json(response);
  }

  async consultar(req: Request, res: Response) {
    const { restauranteId } = req.params;
    const usuarioId = req.user?.id;

    const avaliacao = await prisma.avaliacao.findFirst({
        where: { usuario_id: usuarioId, restaurante_id: Number(restauranteId) }
    });

    if(!avaliacao) return res.status(404).json({detail: 'Avaliação não encontrada'});
    
    return res.json({
        ...avaliacao,
        usuario: avaliacao.usuario_id,
        restaurante: avaliacao.restaurante_id
    });
  }
  
  async minhasAvaliacoes(req: Request, res: Response) {
      const usuarioId = req.user?.id;
      const avaliacoes = await prisma.avaliacao.findMany({
          where: { usuario_id: usuarioId },
          orderBy: { criado_em: 'desc' },
          include: { restaurante: true } 
      });
      return res.json(avaliacoes);
  }
}