# Usa uma imagem oficial do Node.js (Alpine para ser mais leve)
FROM node:22-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos do frontend
COPY . .

# Faz o build de produção do Next.js
RUN npm run build

# O docker-compose mapeia a porta 8085
ENV PORT=8085
ENV HOSTNAME="0.0.0.0"

# Expõe a porta para a rede do Docker
EXPOSE 8085

# Inicia o servidor do Next.js em produção
CMD ["npm", "start"]
