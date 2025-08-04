import React from 'react';
import './HelpModal.css';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📚 Guía de Uso</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          <div className="help-section">
            <h3>🚀 ¿Cómo usar AnalytiCore?</h3>
            <ol>
              <li><strong>Escribe tu texto:</strong> Introduce el texto que deseas analizar en el área de texto.</li>
              <li><strong>Envía para análisis:</strong> Haz clic en "Analizar Texto" para procesar tu contenido.</li>
              <li><strong>Espera los resultados:</strong> El sistema procesará tu texto y mostrará los resultados.</li>
              <li><strong>Revisa el historial:</strong> Consulta tus análisis anteriores en la sección de historial.</li>
            </ol>
          </div>

          <div className="help-section">
            <h3>📊 Características del Análisis</h3>
            <ul>
              <li><strong>Análisis de Sentimiento:</strong> Detecta si el texto es positivo, negativo o neutral.</li>
              <li><strong>Palabras Clave:</strong> Identifica los términos más importantes del texto.</li>
              <li><strong>Entidades:</strong> Reconoce nombres, lugares, organizaciones y otros elementos.</li>
              <li><strong>Detección de Idioma:</strong> Identifica automáticamente el idioma del texto.</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>⚡ Funcionalidades Avanzadas</h3>
            <ul>
              <li><strong>Modo Oscuro:</strong> Cambia entre tema claro y oscuro con el botón 🌙/☀️</li>
              <li><strong>Estadísticas:</strong> Visualiza el resumen de tus análisis realizados.</li>
              <li><strong>Historial:</strong> Mantiene un registro de tus últimos 10 análisis.</li>
              <li><strong>Copiar Resultados:</strong> Copia los resultados al portapapeles con un clic.</li>
              <li><strong>Tiempo de Procesamiento:</strong> Muestra cuánto tiempo tomó cada análisis.</li>
            </ul>
          </div>

          <div className="help-section">
            <h3>💡 Consejos</h3>
            <ul>
              <li>Para mejores resultados, usa textos de al menos 10 palabras.</li>
              <li>El sistema funciona mejor con textos en español e inglés.</li>
              <li>Los análisis se guardan automáticamente en tu navegador.</li>
              <li>Puedes limpiar el historial cuando quieras.</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn" onClick={onClose}>
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal; 