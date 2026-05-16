FROM node:22-alpine

RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

USER node

COPY --chown=node:node package*.json ./
COPY --chown=node:node patches ./patches

RUN npm ci

COPY --chown=node:node . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--port", "3000", "--host"]