# LavrasEats — Descubra os Melhores Restaurantes de Lavras com IA! 🤖❤️

Uma plataforma inteligente para avaliar e descobrir restaurantes em Lavras.
Os usuários escrevem avaliações com texto livre, e a **IA do Google Gemini** analisa o sentimento, atribui uma nota de 0 a 10 e verifica critérios de segurança sanitária.
Além disso, o usuário pode escrever um **prompt** pedindo sugestões, e a IA recomenda os restaurantes mais compatíveis com o pedido.

---

## 💡 Sobre o Projeto

LavrasEats é uma plataforma web onde qualquer pessoa pode deixar uma avaliação textual sobre um restaurante de Lavras.
Diferente dos sistemas tradicionais, aqui usamos **Inteligência Artificial** para:
1. Auditar avaliações (detectando riscos sanitários graves).
2. Gerar notas técnicas baseadas em critérios (Sabor, Atendimento, etc.).
3. Atuar como um Concierge para recomendar o restaurante ideal baseado no desejo do usuário.

Exemplo:
> "Quero tomar um açaí hoje que seja bem recheado e barato"

A IA buscará nas avaliações existentes restaurantes de açaí bem avaliados neste quesito e indicará o melhor match.

---

## 🎯 Objetivos

- Criar uma forma inovadora de avaliar restaurantes com base em sentimentos e experiências reais.
- Utilizar IA para:
  - Classificar textos como positivos, neutros ou negativos.
  - Atribuir uma nota técnica (0 a 10) ou vetar restaurantes com problemas de higiene.
  - Responder prompts de recomendação de forma consultiva.
- Exibir os restaurantes mais bem avaliados da cidade.
- Permitir buscas avançadas por categoria e ranking.

---

## 🧠 Como Funciona

1. **Avaliação (Auditoria IA):**
   O usuário escreve uma avaliação livre. O backend envia para o **Gemini AI** com um prompt de auditoria que:
   - Verifica **gatilhos de segurança** (ratos, intoxicação, etc.) -> Nota 0 imediata.
   - Se seguro, calcula a nota baseada em Sabor (40%), Atendimento (20%), etc.
   - Gera um parecer técnico justificando a nota.

2. **Recomendação (Concierge IA):**
   O usuário escreve: *"Quero um lugar romântico com massa boa."*
   A IA analisa o banco de dados e as avaliações para encontrar o restaurante que melhor atende à intenção do usuário, explicando o porquê da escolha.

---

## 🚀 Funcionalidades

- 📝 **Cadastro de restaurantes** (com upload de fotos) e envio de avaliações textuais.
- 🤖 **Análise automática** de sentimento, nota e segurança alimentar com IA.
- 🔎 **Busca Inteligente** por categoria, nome e ranking (melhores/piores).
- 💬 **Recomendação via Prompt** para sugestões personalizadas.
- ⭐ **Cálculo dinâmico** de média de notas.
- 🔐 **Autenticação JWT** completa (Login, Cadastro).
- 📧 **Confirmação de Email** automatizada.

---

## ⚙️ Tecnologias Utilizadas

**Backend**
- **Node.js + TypeScript**: Plataforma principal.
- **Express**: Framework de API RESTful.
- **Prisma ORM**: Gerenciamento de banco de dados e migrações.
- **PostgreSQL**: Banco de dados relacional.
- **Google Gemini API**: Cérebro da inteligência artificial.
- **Zod**: Validação de dados e segurança da IA.
- **Nodemailer**: Envio de emails transacionais.
- **Multer**: Gerenciamento de upload de imagens.

**Frontend**
- **React + Vite**: Interface web rápida.
- **TailwindCSS**: Estilização moderna.
- **Axios**: Comunicação com a API.

**Infraestrutura**
- **Docker & Docker Compose**: Orquestração completa do ambiente (Banco, Backend, Frontend).

---

## 📖 Guia de Instalação

### 1️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `lavraseats_backend`:

```env
PORT=8000
# URL de conexão interna do Docker
DATABASE_URL="postgresql://postgres:1234@db:5432/lavraseats?schema=public"

# Segurança
JWT_SECRET="sua-chave-super-secreta"

# Inteligência Artificial
GEMINI_API_KEY="sua-chave-da-google-aqui"

# Email (Senha de App do Gmail)
EMAIL_HOST_USER="seu-email@gmail.com"
EMAIL_HOST_PASSWORD="sua-senha-de-app"

```
Crie um arquivo `.env` dentro da pasta `lavraseats_frontend`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_NODE_ENV=development
```

---

### 2️⃣ Executar o Projeto

Na raiz do projeto (onde está o docker-compose.yml), execute:

```bash
docker-compose up --build
```

Isso fará automaticamente:

- O PostgreSQL iniciar.  
- O Prisma criar todas as tabelas no banco.  
- Um Super Usuário (Gerente) ser criado automaticamente.  
- O Backend iniciar na porta 8000 e o Frontend na 3000.  

---

### 3️⃣ Acessar a Aplicação

Frontend: http://localhost:3000  
Backend API: http://localhost:8000  

Login de Administrador (Gerado Automaticamente):

- **Email:** admin@lavraseats.com  
- **Senha:** 123456  

Este usuário pode cadastrar, editar e excluir restaurantes.

---

## 🛑 Comandos Úteis

Para parar a execução:

```bash
docker-compose down
```

Para reiniciar apenas o backend:

```bash
docker-compose restart backend
```

Para limpar tudo (reset total do banco):

```bash
docker-compose down -v
```

---

## 👥 Integrantes do Projeto

- 🎓 Leonardo Gonçalves Flora

---

## 🧠 Inspiração

Comer bem é uma experiência única — mas nem sempre as estrelas do Google contam a história completa.  
O LavrasEats quer mudar isso, valorizando o que os clientes realmente sentem e garantindo recomendações seguras e personalizadas.
