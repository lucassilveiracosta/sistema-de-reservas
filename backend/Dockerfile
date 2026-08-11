FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

# Instala todas as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Gera o Prisma Client com os binários corretos para Alpine Linux
RUN npx prisma generate

# Faz o build da aplicação NestJS
RUN npm run build

# Expõe a porta que a aplicação vai rodar
EXPOSE 3003

# Na inicialização do container, aplica as tabelas no DB (push) e inicia o servidor
CMD ["sh", "-c", "npx prisma db push && npm run start:prod"]
