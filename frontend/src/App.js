import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "./config";
import HelpModal from "./components/HelpModal";
import "./App.css";

function App() {
  const [text, setText] = useState("");
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
    errorJobs: 0,
  });
  const [characterCount, setCharacterCount] = useState(0);
  const [processingTime, setProcessingTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  // Efecto para el modo oscuro
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Cargar historial desde localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("jobHistory");
    if (savedHistory) {
      setJobHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Actualizar estadísticas cuando cambia el historial
  useEffect(() => {
    const newStats = {
      totalJobs: jobHistory.length,
      completedJobs: jobHistory.filter((job) => job.estado === "COMPLETADO")
        .length,
      pendingJobs: jobHistory.filter((job) => job.estado === "PENDIENTE")
        .length,
      errorJobs: jobHistory.filter((job) => job.estado === "ERROR").length,
    };
    setStats(newStats);
  }, [jobHistory]);

  // Función para guardar en historial
  const saveToHistory = (job) => {
    // Mantener solo los últimos 10
    const newHistory = [job, ...jobHistory.slice(0, 9)]; 
    setJobHistory(newHistory);
    localStorage.setItem("jobHistory", JSON.stringify(newHistory));
  };

  // Función para calcular tiempo de procesamiento
  const calculateProcessingTime = () => {
    if (startTime && jobStatus === "COMPLETADO") {
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
      setError("Por favor, introduce algún texto para analizar.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setJobStatus(null);
    setJobResults(null);
    setProcessingTime(null);
    setStartTime(Date.now());

    try {
      const response = await axios.post(config.ENDPOINTS.CREATE_JOB, {
        texto: text,
      });

      const newJob = {
        id: response.data.id,
        texto: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
        estado: "PENDIENTE",
        created_at: new Date().toISOString(),
      };

      saveToHistory(newJob);
      setJobStatus("PENDIENTE");

      // Iniciar polling para verificar el estado
      startPolling(response.data.id);
    } catch (err) {
      console.error("Error al enviar el trabajo:", err);
      setError("Error al enviar el trabajo. Por favor, intenta de nuevo.");
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
        const updatedHistory = jobHistory.map((job) =>
          job.id === id ? { ...job, estado, resultado } : job
        );
        setJobHistory(updatedHistory);
        localStorage.setItem("jobHistory", JSON.stringify(updatedHistory));

        if (estado === config.JOB_STATUS.COMPLETED) {
          setJobResults(resultado);
          setProcessingTime(calculateProcessingTime());
          // Debug: Mostrar en consola los datos que llegan del backend
          console.log("🔍 Datos recibidos del backend:", resultado);

          clearInterval(interval);
          setPollingInterval(null);
        } else if (estado === config.JOB_STATUS.ERROR) {
          setError("Error en el procesamiento del análisis.");
          clearInterval(interval);
          setPollingInterval(null);
        }
      } catch (err) {
        console.error("Error al consultar el estado:", err);
        setError("Error al consultar el estado del trabajo.");
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
      case "PENDIENTE":
        return "Pendiente";
      case "PROCESANDO":
        return "Procesando";
      case "COMPLETADO":
        return "Completado";
      case "ERROR":
        return "Error";
      default:
        return "Desconocido";
    }
  };

  // Función para obtener la clase CSS del estado
  const getStatusClass = (status) => {
    switch (status) {
      case "PENDIENTE":
        return "status-pending";
      case "PROCESANDO":
        return "status-processing";
      case "COMPLETADO":
        return "status-completed";
      case "ERROR":
        return "status-error";
      default:
        return "";
    }
  };

  // Función para limpiar el historial
  const clearHistory = () => {
    setJobHistory([]);
    localStorage.removeItem("jobHistory");
  };

  return (
    <div className="container">
      {/* Header compacto */}
      <div className="header">
        <h1>AnalytiCore</h1>
        <div className="header-stats">
          <span>📊 {stats.totalJobs}</span>
          <span>✅ {stats.completedJobs}</span>
          <span>⏳ {stats.pendingJobs}</span>
          <span>❌ {stats.errorJobs}</span>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Modo claro" : "Modo oscuro"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Layout de 3 columnas */}
      <div className="three-column-layout">
        {/* Columna 1: Insertar texto */}
        <div className="column input-column">
          <div className="column-header">
            <h3>📝 Insertar Texto</h3>
          </div>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setCharacterCount(e.target.value.length);
                }}
                placeholder="Introduce el texto a analizar..."
                disabled={isSubmitting || jobStatus === "PROCESANDO"}
              />
              <div className="form-footer">
                <span className="character-count">{characterCount} chars</span>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={
                    isSubmitting || jobStatus === "PROCESANDO" || !text.trim()
                  }
                >
                  {isSubmitting ? "Enviando..." : "Analizar"}
                </button>
              </div>
            </form>
          </div>

          {/* Mensaje de error */}
          {error && <div className="error">{error}</div>}
        </div>

        {/* Columna 2: Resultados */}
        <div className="column results-column">
          <div className="column-header">
            <h3>📊 Resultados</h3>
          </div>

          {jobStatus && (
            <div className="status-container">
              <div className="status-header">
                <span className={`status-badge ${getStatusClass(jobStatus)}`}>
                  {getStatusText(jobStatus)}
                </span>
                {processingTime && (
                  <span className="processing-time">{processingTime}</span>
                )}
              </div>

              {jobStatus === "COMPLETADO" && jobResults && (
                <div className="results-container">
                  <div className="results-header">
                    <span>Análisis Completado</span>
                  </div>

                  {/* Debug: Mostrar estructura completa */}
                  <div className="debug-section">
                    <div className="result-title">
                      🔍 Datos Completos del Backend
                    </div>
                    <div className="result-data">
                      <pre className="debug-json">
                        {JSON.stringify(jobResults, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!jobStatus && (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p>Los resultados aparecerán aquí después del análisis</p>
            </div>
          )}
        </div>

        {/* Columna 3: Historial */}
        <div className="column history-column">
          <div className="column-header">
            <h3>📚 Historial</h3>
            <button className="clear-history" onClick={clearHistory}>
              🗑️
            </button>
          </div>

          {jobHistory.length > 0 ? (
            <div className="history-list">
              {jobHistory.map((job, index) => (
                <div key={index} className="history-item">
                  <div className="history-text">{job.texto}</div>
                  <span
                    className={`history-status ${getStatusClass(job.estado)}`}
                  >
                    {getStatusText(job.estado)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <p>No hay análisis previos</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de ayuda */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

export default App;
