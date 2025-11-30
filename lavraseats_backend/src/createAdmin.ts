import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando criação do Super Usuário...');

  const passwordHash = await bcrypt.hash("123456", 8);

  try {
    const admin = await prisma.usuario.upsert({
      where: { email: 'lavraseats@gmail.com' },
      update: {},
      create: {
        nome: 'Leonardo Gonçalves',
        email: 'lavraseats@gmail.com',
        cpf: '111.111.111-11',
        senha: passwordHash,
        cargo: 'gerente',
        is_active: true,  
        codigo_confirmacao: null
      },
    });

    console.log('✅ Super Usuário garantido!');
    console.log('📧 Email: lavraseats@gmail.com');
    console.log('🔑 Senha: 123456');
  } catch (e) {
    console.error('❌ Erro ao criar admin:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();