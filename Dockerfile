FROM node:9
WORKDIR /app
COPY ./ ./
RUN npm install
CMD ["npm", "run", "prod"]
