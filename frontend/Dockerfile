FROM node:22-alpine
WORKDIR /app

# Add build-time argument for the API URL
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
COPY patches ./patches
RUN npm install

COPY . .
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Use vite preview to serve the built application on port 3000
CMD ["npm", "run", "preview", "--", "--port", "3000", "--host"]