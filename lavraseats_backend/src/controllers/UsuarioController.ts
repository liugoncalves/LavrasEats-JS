import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export class UsuarioController {
  async cadastrar(req: Request, res: Response) {
    const { nome, email, cpf, senha, cargo } = req.body;

    const userExists = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { cpf }] },
    });

    if (userExists) {
      return res.status(400).json({ erro: 'Usuário ou CPF já cadastrado' });
    }

    const passwordHash = await bcrypt.hash(senha, 8);
    const codigoConfirmacao = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await prisma.usuario.create({
      data: {
        nome,
        email,
        cpf,
        senha: passwordHash,
        cargo: cargo || 'usuario',
        is_active: false, // Precisa confirmar email
        codigo_confirmacao: codigoConfirmacao
      },
    });

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_HOST_USER,
          pass: process.env.EMAIL_HOST_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: 'LavrasEats <noreply@lavraseats.com>',
        to: email,
        subject: 'Confirmação de Cadastro - LavrasEats',
        text: `Seu código de confirmação é: ${codigoConfirmacao}`,
      });
    } catch (error) {
      console.log('Erro ao enviar email (verifique .env):', error);
      console.log('Código gerado:', codigoConfirmacao);
    }

    return res.status(201).json({ mensagem: 'Usuário cadastrado. Verifique seu email.' });
  }

  async confirmar(req: Request, res: Response) {
    const { cpf, codigo } = req.query;

    const user = await prisma.usuario.findUnique({
      where: { cpf: String(cpf) },
    });

    if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });
    
    if (user.codigo_confirmacao !== codigo) {
      return res.status(400).json({ erro: 'Código incorreto' });
    }

    await prisma.usuario.update({
      where: { id: user.id },
      data: { is_active: true, codigo_confirmacao: null },
    });

    return res.status(200).json({ mensagem: 'Cadastro confirmado com sucesso!' });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) return res.status(401).json({ detail: 'Email ou senha incorretos' });

    if (!user.is_active) {
       return res.status(401).json({ 
         detail: 'Conta não confirmada', 
         cpf: user.cpf 
       });
    }

    const passwordMatch = await bcrypt.compare(password, user.senha);

    if (!passwordMatch) return res.status(401).json({ detail: 'Email ou senha incorretos' });

    const token = jwt.sign(
      { id: user.id, email: user.email, cargo: user.cargo, nome: user.nome, cpf: user.cpf },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' } // Access token
    );

    const refresh = jwt.sign(
        { id: user.id }, 
        process.env.JWT_SECRET as string, 
        { expiresIn: '7d' }
    );

    return res.json({
      access: token,
      refresh: refresh,
      id: user.id,
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      cargo: user.cargo
    });
  }

  async me(req: Request, res: Response) {
    const user = await prisma.usuario.findUnique({
        where: { id: req.user?.id },
        select: { id: true, nome: true, email: true, cpf: true, cargo: true, is_active: true }
    });
    return res.json(user);
  }
}