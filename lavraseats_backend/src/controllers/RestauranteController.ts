import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class RestauranteController {
  async listar(req: Request, res: Response) {
    try {
        const restaurantes = await prisma.restaurante.findMany();
        return res.json(restaurantes);
    } catch (error) {
        return res.status(500).json({ erro: 'Erro ao listar restaurantes' });
    }
  }

  async cadastrar(req: Request, res: Response) {
    const { nome, descricao, categoria, endereco, telefone } = req.body;
    const poster = req.file ? req.file.filename : null;

    try {
      const restaurante = await prisma.restaurante.create({
        data: { nome, descricao, categoria, endereco, telefone, poster },
      });
      return res.status(201).json({ mensagem: 'Restaurante cadastrado', restaurante });
    } catch (error) {
      return res.status(400).json({ erro: 'Erro ao cadastrar. Verifique os dados.' });
    }
  }

  async consultar(req: Request, res: Response) {
    const { id } = req.params;

    // Validação de segurança para não quebrar o Prisma
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ erro: 'ID inválido' });
    }

    try {
        const restaurante = await prisma.restaurante.findUnique({
            where: { id: Number(id) },
        });

        if (!restaurante) return res.status(404).json({ erro: 'Restaurante não encontrado' });
        return res.json(restaurante);
    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno no servidor' });
    }
  }

  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    if (req.file) data.poster = req.file.filename;

    try {
      const restaurante = await prisma.restaurante.update({
        where: { id: Number(id) },
        data,
      });
      return res.json({ mensagem: 'Atualizado com sucesso', restaurante });
    } catch (error) {
      return res.status(400).json({ erro: 'Erro ao atualizar' });
    }
  }

  async deletar(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await prisma.restaurante.delete({ where: { id: Number(id) } });
      return res.json({ mensagem: 'Deletado com sucesso' });
    } catch (error) {
      return res.status(404).json({ erro: 'Não encontrado' });
    }
  }

  async ranking(req: Request, res: Response) {
    const { ordem } = req.query;
    const orderBy = ordem === 'piores' ? { nota_media: 'asc' } : { nota_media: 'desc' };

    const restaurantes = await prisma.restaurante.findMany({
      where: { numero_avaliacoes: { gt: 0 } },
      orderBy: [ orderBy as any, { numero_avaliacoes: 'desc' } ],
      take: 10
    });
    return res.json(restaurantes);
  }

  async filtrar(req: Request, res: Response) {
    const { categoria, ordem_nota } = req.query;
    let where = {};
    if (categoria) where = { categoria: { contains: String(categoria), mode: 'insensitive' } };

    let orderBy = {};
    if (ordem_nota === 'asc') orderBy = { nota_media: 'asc' };
    if (ordem_nota === 'desc') orderBy = { nota_media: 'desc' };

    const restaurantes = await prisma.restaurante.findMany({
      where,
      orderBy: Object.keys(orderBy).length ? orderBy : undefined
    });
    return res.json(restaurantes);
  }
}