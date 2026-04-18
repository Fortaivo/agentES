FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/worker/package.json ./apps/worker/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json

RUN npm install

COPY apps/worker ./apps/worker
COPY packages/contracts ./packages/contracts

CMD ["npm", "run", "dev", "--workspace", "@agentes/worker"]
