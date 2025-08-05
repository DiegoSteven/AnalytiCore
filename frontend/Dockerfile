# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN npm install

# Copiar código fuente
COPY . .

# Generar el build de producción
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

WORKDIR /app

# Instalar serve globalmente
RUN npm install -g serve

# Copiar solo los archivos del build desde la etapa anterior
COPY --from=builder /app/build ./build

# Exponer el puerto 3000
EXPOSE 3000

# Comando para servir los archivos estáticos
CMD ["serve", "-s", "build", "-l", "3000"] 