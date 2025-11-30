FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm install

COPY . .

# Gera o cliente do Prisma
RUN npx prisma generate

EXPOSE 8000

CMD ["npm", "run", "dev"]