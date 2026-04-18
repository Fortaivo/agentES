FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json

RUN npm install

COPY apps/api ./apps/api
COPY packages/contracts ./packages/contracts

CMD ["npm", "run", "dev", "--workspace", "@agentes/api"]
