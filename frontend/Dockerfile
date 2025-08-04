# Imagen base de Node.js
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Exponer el puerto 3000
EXPOSE 3000

# Comando para ejecutar en modo desarrollo
CMD ["npm", "start"] 