# AnalytiCore - Análisis de Texto con IA

AnalytiCore es una aplicación web moderna para el análisis de texto utilizando inteligencia artificial. Proporciona análisis de sentimiento, extracción de palabras clave, detección de entidades y más.

## 🚀 Características Principales

### ✨ Funcionalidades del Frontend

- **🎨 Diseño Moderno**: Interfaz elegante con gradientes y efectos de cristal
- **🌙 Modo Oscuro**: Toggle entre tema claro y oscuro
- **📊 Estadísticas en Tiempo Real**: Dashboard con métricas de análisis
- **📝 Historial de Análisis**: Registro de los últimos 10 análisis realizados
- **⏱️ Tiempo de Procesamiento**: Muestra el tiempo que toma cada análisis
- **📋 Copiar Resultados**: Función para copiar resultados al portapapeles
- **📏 Contador de Caracteres**: Seguimiento en tiempo real del texto
- **❓ Sistema de Ayuda**: Modal con guía completa de uso
- **📱 Diseño Responsivo**: Optimizado para móviles y tablets

### 🔧 Funcionalidades Técnicas

- **🔄 Polling Inteligente**: Consulta automática del estado de los trabajos
- **💾 Persistencia Local**: Historial guardado en localStorage
- **🎯 Validación de Formularios**: Prevención de envíos vacíos
- **⚡ Animaciones Suaves**: Transiciones y efectos visuales
- **♿ Accesibilidad**: Navegación por teclado y lectores de pantalla

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18**: Framework principal
- **Axios**: Cliente HTTP para APIs
- **CSS3**: Estilos modernos con gradientes y animaciones
- **LocalStorage**: Persistencia de datos del usuario

### Backend
- **Python FastAPI**: Servicio de submisión
- **Java Spring Boot**: Servicio de análisis
- **PostgreSQL**: Base de datos
- **Docker**: Contenedores para todos los servicios

## 📦 Instalación y Configuración

### Prerrequisitos
- Docker y Docker Compose
- Node.js (para desarrollo local)

### Configuración Rápida

1. **Clonar el repositorio**:
```bash
git clone <repository-url>
cd analytiCore
```

2. **Crear archivos de configuración**:
```bash
# Ejecutar el script de PowerShell
powershell -ExecutionPolicy Bypass -File create_env_files.ps1
```

3. **Iniciar los servicios**:
```bash
docker-compose up --build
```

4. **Acceder a la aplicación**:
- Frontend: http://localhost:3000
- API Python: http://localhost:8000
- API Java: http://localhost:8080

## 🎯 Uso de la Aplicación

### Flujo de Trabajo

1. **Escribir Texto**: Introduce el texto que deseas analizar
2. **Enviar Análisis**: Haz clic en "Analizar Texto"
3. **Esperar Resultados**: El sistema procesa automáticamente
4. **Revisar Resultados**: Visualiza sentimiento, palabras clave, etc.
5. **Gestionar Historial**: Consulta análisis anteriores

### Características del Análisis

- **Análisis de Sentimiento**: Positivo, negativo o neutral
- **Palabras Clave**: Términos más importantes del texto
- **Entidades**: Nombres, lugares, organizaciones
- **Detección de Idioma**: Identificación automática del idioma

## 🎨 Características de UX/UI

### Diseño Visual
- **Gradientes Modernos**: Fondos con gradientes atractivos
- **Efectos de Cristal**: Backdrop blur y transparencias
- **Animaciones Suaves**: Transiciones fluidas entre estados
- **Iconografía**: Emojis y símbolos intuitivos

### Interactividad
- **Hover Effects**: Efectos al pasar el mouse
- **Loading States**: Indicadores de carga animados
- **Error Handling**: Manejo elegante de errores
- **Success Feedback**: Confirmaciones visuales

### Responsividad
- **Mobile First**: Diseño optimizado para móviles
- **Tablet Support**: Adaptación para tablets
- **Desktop Experience**: Experiencia completa en escritorio

## 🔧 Configuración Avanzada

### Variables de Entorno

#### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_PROXY_URL=http://python-service:8000
CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true
```

#### Python Service (.env)
```env
DB_NAME=analyti_core_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432
JAVA_SERVICE_URL=http://java-service:8080/analyze
APP_HOST=0.0.0.0
APP_PORT=8000
DEBUG=true
```

#### Java Service (.env)
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/analyti_core_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev
```

## 📊 API Endpoints

### Python Service
- `POST /api/v1/jobs` - Crear nuevo trabajo
- `GET /api/v1/jobs/{id}` - Consultar estado del trabajo

### Java Service
- `POST /analyze` - Procesar análisis de texto

## 🚀 Desarrollo

### Estructura del Proyecto
```
analytiCore/
├── frontend/           # Aplicación React
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── App.js      # Componente principal
│   │   └── App.css     # Estilos principales
├── python-service/     # Servicio Python FastAPI
├── java-service/       # Servicio Java Spring Boot
└── docker-compose.yml  # Configuración de contenedores
```

### Comandos de Desarrollo

```bash
# Desarrollo local del frontend
cd frontend
npm start

# Reconstruir contenedores
docker-compose up --build

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
```

## 🎯 Roadmap

### Próximas Características
- [ ] **Exportación de Resultados**: PDF, CSV, JSON
- [ ] **Análisis por Lotes**: Múltiples textos simultáneos
- [ ] **Gráficos Interactivos**: Visualizaciones de datos
- [ ] **Notificaciones Push**: Alertas en tiempo real
- [ ] **Autenticación**: Sistema de usuarios
- [ ] **API Rate Limiting**: Control de uso
- [ ] **Tests Automatizados**: Cobertura completa
- [ ] **CI/CD Pipeline**: Despliegue automático

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- 📧 Email: support@analyticore.com
- 🐛 Issues: GitHub Issues
- 📖 Documentación: Wiki del proyecto

---

**AnalytiCore** - Transformando el análisis de texto con IA 🚀 