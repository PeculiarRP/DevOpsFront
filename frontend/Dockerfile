FROM node:23-alpine
WORKDIR /app
ADD package*.json ./
# RUN npm install vite --save-dev
RUN npm install
COPY . .
# WORKDIR /frontend/
# CMD ["npm", "run", "dev"]