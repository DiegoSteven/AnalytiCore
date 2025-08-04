import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';
import HelpModal from './components/HelpModal';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [jobResults, setJobResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [jobHistory, setJobHistory] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    errorJobs: 0
  });
  const [showHistory, setShowHistory] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [processingTime, setProcessingTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  // Efecto para el modo oscuro
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Cargar historial desde localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('jobHistory');
    if (savedHistory) {
      setJobHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Actualizar estadísticas cuando cambia el historial
  useEffect(() => {
    const newStats = {
      totalJobs: jobHistory.length,
      completedJobs: jobHistory.filter(job => job.estado === 'COMPLETADO').length,
      pendingJobs: jobHistory.filter(job => job.estado === 'PENDIENTE').length,
      errorJobs: jobHistory.filter(job => job.estado === 'ERROR').length
    };
    setStats(newStats);
  }, [jobHistory]);

  // Función para guardar en historial
  const saveToHistory = (job) => {
    const newHistory = [job, ...jobHistory.slice(0, 9)]; // Mantener solo los últimos 10
    setJobHistory(newHistory);
    localStorage.setItem('jobHistory', JSON.stringify(newHistory));
  };

  // Función para calcular tiempo de procesamiento
  const calculateProcessingTime = () => {
    if (startTime && jobStatus === 'COMPLETADO') {
      const endTime = Date.now();
      const timeDiff = endTime - startTime;
      const seconds = Math.floor(timeDiff / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }
    return null;
  };

  // Función para enviar el texto al servicio Python
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Por favor, introduce algún texto para analizar.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setJobId(null);
    setJobStatus(null);
    setJobResults(null);
    setProcessingTime(null);
    setStartTime(Date.now());

    try {
      const response = await axios.post(config.ENDPOINTS.CREATE_JOB, {
        texto: text
      });

      const newJob = {
        id: response.data.id,
        texto: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
        estado: 'PENDIENTE',
        created_at: new Date().toISOString()
      };

      saveToHistory(newJob);
      setJobId(response.data.id);
      setJobStatus('PENDIENTE');
      
      // Iniciar polling para verificar el estado
      startPolling(response.data.id);
      
    } catch (err) {
      console.error('Error al enviar el trabajo:', err);
      setError('Error al enviar el trabajo. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para iniciar el polling del estado del trabajo
  const startPolling = (id) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(config.ENDPOINTS.GET_JOB(id));
        const { estado, resultado } = response.data;
        
        setJobStatus(estado);
        
        // Actualizar el trabajo en el historial
        const updatedHistory = jobHistory.map(job => 
          job.id === id ? { ...job, estado, resultado } : job
        );
        setJobHistory(updatedHistory);
        localStorage.setItem('jobHistory', JSON.stringify(updatedHistory));
        
        if (estado === config.JOB_STATUS.COMPLETED) {
          setJobResults(resultado);
          setProcessingTime(calculateProcessingTime());
          clearInterval(interval);
          setPollingInterval(null);
        } else if (estado === config.JOB_STATUS.ERROR) {
          setError('Error en el procesamiento del análisis.');
          clearInterval(interval);
          setPollingInterval(null);
        }
        
      } catch (err) {
        console.error('Error al consultar el estado:', err);
        setError('Error al consultar el estado del trabajo.');
        clearInterval(interval);
        setPollingInterval(null);
      }
    }, config.POLLING_INTERVAL);

    setPollingInterval(interval);
  };

  // Limpiar el intervalo cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Función para obtener el texto del estado
  const getStatusText = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'PROCESANDO':
        return 'Procesando';
      case 'COMPLETADO':
        return 'Completado';
      case 'ERROR':
        return 'Error';
      default:
        return 'Desconocido';
    }
  };

  // Función para obtener la clase CSS del estado
  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return 'status-pending';
      case 'PROCESANDO':
        return 'status-processing';
      case 'COMPLETADO':
        return 'status-completed';
      case 'ERROR':
        return 'status-error';
      default:
        return '';
    }
  };

  // Función para limpiar el historial
  const clearHistory = () => {
    setJobHistory([]);
    localStorage.removeItem('jobHistory');
  };

  // Función para copiar resultados al portapapeles
  const copyResults = () => {
    if (jobResults) {
      const resultsText = JSON.stringify(jobResults, null, 2);
      navigator.clipboard.writeText(resultsText);
      alert('Resultados copiados al portapapeles');
    }
  };

  return (
    <div className="container">
      {/* Header minimalista */}
      <div className="header">
        <div className="header-top">
          <h1>AnalytiCore</h1>
          <div className="header-actions">
            <button 
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Modo claro' : 'Modo oscuro'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas compactas */}
      <div className="stats-container">
        <div className="stat-item">Total: {stats.totalJobs}</div>
        <div className="stat-item">✓ {stats.completedJobs}</div>
        <div className="stat-item">⏳ {stats.pendingJobs}</div>
        <div className="stat-item">❌ {stats.errorJobs}</div>
      </div>

      {/* Formulario principal */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setCharacterCount(e.target.value.length);
            }}
            placeholder="Introduce el texto a analizar..."
            disabled={isSubmitting || jobStatus === 'PROCESANDO'}
          />
          <div className="form-footer">
            <span className="character-count">{characterCount} chars</span>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting || jobStatus === 'PROCESANDO' || !text.trim()}
            >
              {isSubmitting ? 'Enviando...' : 'Analizar'}
            </button>
          </div>
        </form>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* Estado del trabajo */}
      {jobStatus && (
        <div className="status-container">
          <div className="status-header">
            <span className={`status-badge ${getStatusClass(jobStatus)}`}>
              {getStatusText(jobStatus)}
            </span>
            {processingTime && <span className="processing-time">{processingTime}</span>}
          </div>
          
          {jobStatus === 'COMPLETADO' && jobResults && (
            <div className="results-container">
              <div className="results-header">
                <span>Resultados</span>
                <button className="copy-btn" onClick={copyResults}>📋</button>
              </div>
              
              <div className="results-grid">
                {jobResults.sentiment && (
                  <div className="result-card">
                    <div className="result-label">Sentimiento</div>
                    <div className="result-value">{jobResults.sentiment}</div>
                  </div>
                )}
                
                {jobResults.keywords && jobResults.keywords.length > 0 && (
                  <div className="result-card">
                    <div className="result-label">Palabras Clave</div>
                    <div className="result-value">{jobResults.keywords.join(', ')}</div>
                  </div>
                )}
                
                {jobResults.summary && (
                  <div className="result-card full-width">
                    <div className="result-label">Resumen</div>
                    <div className="result-value">{jobResults.summary}</div>
                  </div>
                )}
                
                {jobResults.language && (
                  <div className="result-card">
                    <div className="result-label">Idioma</div>
                    <div className="result-value">{jobResults.language}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Historial compacto */}
      {jobHistory.length > 0 && (
        <div className="history-container">
          <div className="history-header">
            <span>Historial ({jobHistory.length})</span>
            <div className="history-actions">
              <button 
                className="history-toggle"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? 'Ocultar' : 'Mostrar'}
              </button>
              <button className="clear-history" onClick={clearHistory}>🗑️</button>
            </div>
          </div>
          
          {showHistory && (
            <div className="history-list">
              {jobHistory.slice(0, 5).map((job, index) => (
                <div key={index} className="history-item">
                  <div className="history-text">{job.texto}</div>
                  <span className={`history-status ${getStatusClass(job.estado)}`}>
                    {getStatusText(job.estado)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de ayuda */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

export default App; 