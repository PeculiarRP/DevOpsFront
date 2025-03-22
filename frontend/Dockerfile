FROM node:23-alpine
ADD package*.json ./
# RUN npm install vite --save-dev
RUN npm install
WORKDIR /frontend/
CMD ["npm", "run", "dev"]