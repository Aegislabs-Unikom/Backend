# Gunakan image Node.js yang diinginkan
FROM node:18-alpine AS builder

# Set folder kerja (working directory) ke /app
WORKDIR /app

# Salin file package.json dan package-lock.json ke /app
COPY package.json .
COPY package-lock.json .

# Install dependensi Node.js
RUN npm install

# Langkah kedua, gunakan image Node.js yang terpisah
FROM node:18-alpine

# Set folder kerja (working directory) ke /app
WORKDIR /app

# Salin semua file dari image builder ke image ini
COPY --from=builder /app/ .

# Instal MongoDB
RUN apk add --no-cache mongodb-tools

# Expose port yang akan digunakan oleh aplikasi Anda (ganti dengan port yang sesuai)
EXPOSE 5000

# Mulai aplikasi Anda dengan perintah berikut
CMD ["npm", "run", "start"]
