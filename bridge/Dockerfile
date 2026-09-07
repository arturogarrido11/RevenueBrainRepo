FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY dist/ ./dist/
COPY test-openai.cjs ./

EXPOSE 3001

CMD ["node", "dist/index.js"]
