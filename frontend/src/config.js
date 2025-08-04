// Configuración del Frontend
const config = {
  // URL de la API - en desarrollo usa el proxy, en producción usa la URL completa
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  
  // Configuración del proxy para desarrollo
  PROXY_URL: process.env.REACT_APP_PROXY_URL || 'http://python-service:8000',
  
  // Endpoints de la API
  ENDPOINTS: {
    CREATE_JOB: `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/v1/jobs`,
    GET_JOB: (id) => `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/v1/jobs/${id}`,
  },
  
  // Configuración del polling
  POLLING_INTERVAL: 2000, // 5 segundos
  
  // Estados del trabajo
  JOB_STATUS: {
    PENDING: 'PENDIENTE',
    PROCESSING: 'PROCESANDO',
    COMPLETED: 'COMPLETADO',
    ERROR: 'ERROR'
  }
};

export default config; 