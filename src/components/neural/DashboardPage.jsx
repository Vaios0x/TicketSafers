import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTicketAlt, 
  FaChartLine, 
  FaUsers, 
  FaWallet,
  FaSearch,
  FaMicrophone,
  FaRobot,
  FaTimes,
  FaEthereum,
  FaCoins,
  FaArrowUp,
  FaEye,
  FaHeart,
  FaShare,
  FaCalendarAlt,
  FaStar,
  FaDollarSign,
  FaEdit,
  FaUser,
  FaSave,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaBirthdayCake,
  FaGenderless,
  FaBell,
  FaLock
} from 'react-icons/fa';
import { SiPolygon, SiOptimism } from 'react-icons/si';

const DashboardPage = () => {
  const [selectedProfile, setSelectedProfile] = useState('organizador');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Efectos de partículas para el fondo
  const [particles, setParticles] = useState([]);

  // Datos del perfil
  const [profileData, setProfileData] = useState({
    name: 'Usuario Demo',
    email: 'usuario@ticketsafer.com',
    phone: '+52 55 1234 5678',
    location: 'Ciudad de México, México',
    website: 'https://usuario.com',
    bio: 'Apasionado por los eventos y la tecnología blockchain. Siempre buscando las mejores experiencias.',
    birthday: '1990-05-15',
    gender: 'No especificado',
    avatar: null,
    walletAddress: '0x8c...A343',
    joinDate: '2024',
    preferences: {
      notifications: true,
      newsletter: true,
      analytics: false
    }
  });

  // Datos de edición (copia temporal)
  const [editData, setEditData] = useState({});

  useEffect(() => {
    // Generar partículas de fondo
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // Inicializar datos de edición
  useEffect(() => {
    if (showEditModal) {
      setEditData({ ...profileData });
    }
  }, [showEditModal, profileData]);

  // Función para abrir modal de edición
  const openEditModal = () => {
    setShowEditModal(true);
    setSaveSuccess(false);
    setSaveError('');
  };

  // Función para cerrar modal de edición
  const closeEditModal = () => {
    setShowEditModal(false);
    setSaveSuccess(false);
    setSaveError('');
  };

  // Función para guardar cambios
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveError('');
    
    try {
      // Simular guardado en servidor
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular posible error (5% de probabilidad)
      if (Math.random() < 0.05) {
        throw new Error('Error de conexión. Por favor, intenta nuevamente.');
      }
      
      // Actualizar datos del perfil
      setProfileData(editData);
      setSaveSuccess(true);
      
      // Cerrar modal después de mostrar éxito
      setTimeout(() => {
        closeEditModal();
      }, 1500);
      
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Función para manejar cambios en el formulario de edición
  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para manejar cambios en preferencias
  const handleEditPreferenceChange = (preference) => {
    setEditData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: !prev.preferences[preference]
      }
    }));
  };

  // Función para manejar subida de foto de perfil
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona una imagen válida.');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para abrir selector de archivo
  const openFileSelector = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleAvatarUpload;
    input.click();
  };

  // Datos simulados para el dashboard con más variedad
  const dashboardData = {
    organizador: {
      tickets: { 
        value: '1,247', 
        trend: '+12%', 
        color: '#00D4FF',
        icon: FaTicketAlt,
        description: 'Tickets vendidos este mes'
      },
      ventas: { 
        value: '$45,230', 
        trend: '+8%', 
        color: '#8A2BE2',
        icon: FaDollarSign,
        description: 'Ingresos totales'
      },
      eventos: { 
        value: '23', 
        trend: '+3%', 
        color: '#FF6B35',
        icon: FaCalendarAlt,
        description: 'Eventos activos'
      },
      usuarios: { 
        value: '8,945', 
        trend: '+15%', 
        color: '#00FF88',
        icon: FaUsers,
        description: 'Usuarios registrados'
      }
    },
    comprador: {
      tickets: { 
        value: '12', 
        trend: '+2%', 
        color: '#00D4FF',
        icon: FaTicketAlt,
        description: 'Tickets comprados'
      },
      gastos: { 
        value: '$1,240', 
        trend: '+5%', 
        color: '#8A2BE2',
        icon: FaWallet,
        description: 'Gastos totales'
      },
      eventos: { 
        value: '8', 
        trend: '+1%', 
        color: '#FF6B35',
        icon: FaStar,
        description: 'Eventos asistidos'
      },
      favoritos: { 
        value: '34', 
        trend: '+7%', 
        color: '#00FF88',
        icon: FaHeart,
        description: 'Eventos favoritos'
      }
    }
  };

  const aiSuggestions = [
    { icon: '🎵', text: 'Conciertos populares', query: 'conciertos música' },
    { icon: '🎭', text: 'Teatro y shows', query: 'teatro espectáculos' },
    { icon: '🏆', text: 'Eventos deportivos', query: 'deportes competencias' },
    { icon: '🎨', text: 'Arte y cultura', query: 'arte exposiciones' }
  ];

  const handleProfileChange = (e) => {
    setSelectedProfile(e.target.value);
  };

  const handleVoiceSearch = () => {
    setIsVoiceActive(!isVoiceActive);
    // Aquí iría la lógica de reconocimiento de voz
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.query);
  };

  const openWidgetModal = (widgetType) => {
    setSelectedWidget(widgetType);
  };

  const closeWidgetModal = () => {
    setSelectedWidget(null);
  };

  const currentData = dashboardData[selectedProfile];

  return (
    <div className="dashboard-container">
      {/* Partículas de fondo animadas */}
      <div className="dashboard-particles">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="dashboard-title">
              Dashboard Neural
            </h1>
            <p className="dashboard-subtitle">
              {selectedProfile === 'organizador' 
                ? 'Panel de control para organizadores de eventos' 
                : 'Tu centro de control personal'}
            </p>
          </div>
          
          <div className="dashboard-actions">
            <div className="profile-selector">
              <select 
                className="profile-select"
                value={selectedProfile}
                onChange={handleProfileChange}
              >
                <option value="organizador">👔 Organizador</option>
                <option value="comprador">🎟️ Comprador</option>
              </select>
            </div>
            <button className="edit-profile-btn" onClick={openEditModal}>
              <FaEdit />
              Editar Perfil
            </button>
          </div>
        </div>

        {/* Búsqueda con IA */}
        <div className="ai-search-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="ai-search-input"
              placeholder="Busca eventos, estadísticas o pregunta a la IA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className={`voice-btn ${isVoiceActive ? 'active' : ''}`}
              onClick={handleVoiceSearch}
            >
              <FaMicrophone />
            </button>
          </div>
          
          <div className="ai-suggestions">
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                className="ai-suggestion-chip"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span>{suggestion.icon}</span>
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Widgets */}
      <div className="dashboard-grid">
        {Object.entries(currentData).map(([key, data], index) => {
          const IconComponent = data.icon;
          
          return (
            <motion.div
              key={key}
              className="dashboard-widget"
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              onClick={() => openWidgetModal(key)}
              whileHover={{ 
                scale: 1.02,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="widget-header">
                <motion.div 
                  className="widget-icon"
                  whileHover={{ 
                    rotateY: 15,
                    scale: 1.1,
                    transition: { duration: 0.3 }
                  }}
                >
                  <IconComponent />
                </motion.div>
                <div className="widget-info">
                  <h3 className="widget-title">
                    {data.description}
                  </h3>
                </div>
              </div>
              
              <div className="widget-content">
                <motion.div 
                  className="widget-value" 
                  style={{ color: data.color }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                >
                  {data.value}
                </motion.div>
                
                <motion.div 
                  className="widget-trend"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 + 0.5 }}
                >
                  <FaArrowUp />
                  {data.trend}
                </motion.div>
              </div>
              
              <div className="widget-glow" style={{ background: `radial-gradient(circle, ${data.color}20 0%, transparent 70%)` }} />
              
              {/* Efecto de brillo en hover */}
              <motion.div 
                className="widget-shine"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
          );
        })}


      </div>

      {/* Sección de Analytics */}
      <div className="analytics-section">
        <div className="section-header">
          <h2>Análisis Multichain</h2>
          <p>Rendimiento en tiempo real across blockchains</p>
        </div>
        
        <div className="analytics-grid">
          <motion.div
            className="analytics-chart"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="chart-header">
              <h3>Distribución por Blockchain</h3>
              <div className="chart-networks">
                <FaEthereum style={{ color: '#627EEA' }} />
                <SiPolygon style={{ color: '#8247E5' }} />
                <SiOptimism style={{ color: '#FF0420' }} />
              </div>
            </div>
            <div className="chart-placeholder">
              <div className="chart-bars">
                <div className="chart-bar" style={{ height: '80%', background: '#627EEA' }} />
                <div className="chart-bar" style={{ height: '60%', background: '#8247E5' }} />
                <div className="chart-bar" style={{ height: '40%', background: '#FF0420' }} />
                <div className="chart-bar" style={{ height: '90%', background: '#00D4FF' }} />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="ai-predictions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="predictions-header">
              <FaRobot />
              <h3>Predicciones IA</h3>
            </div>
            <div className="predictions-list">
              <div className="prediction-item">
                <span className="prediction-emoji">📈</span>
                <div>
                  <strong>Tendencia Alcista</strong>
                  <p>Se espera un aumento del 25% en ventas esta semana</p>
                </div>
              </div>
              <div className="prediction-item">
                <span className="prediction-emoji">🎵</span>
                <div>
                  <strong>Música Electrónica</strong>
                  <p>Categoría con mayor potencial de crecimiento</p>
                </div>
              </div>
              <div className="prediction-item">
                <span className="prediction-emoji">⛽</span>
                <div>
                  <strong>Gas Optimizado</strong>
                  <p>Mejores tarifas en Polygon este fin de semana</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Asistente IA Flotante */}
      <motion.button
        className="ai-assistant"
        onClick={() => setShowAIChat(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaRobot />
        <div className="ai-tooltip">
          ¿Necesitas ayuda? Pregúntale a la IA
        </div>
      </motion.button>

      {/* Modal de Widget */}
      {selectedWidget && (
        <div className="widget-modal-overlay" onClick={closeWidgetModal}>
          <motion.div
            className="widget-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-icon">
                {selectedWidget === 'tickets' && <FaTicketAlt />}
                {selectedWidget === 'ventas' && <FaWallet />}
                {selectedWidget === 'eventos' && <FaCalendarAlt />}
                {selectedWidget === 'usuarios' && <FaUsers />}
              </div>
              <h2>Detalles - {selectedWidget}</h2>
              <button className="modal-close" onClick={closeWidgetModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-content">
              <div className="modal-stat">
                <span className="modal-value">
                  {currentData[selectedWidget]?.value || 'N/A'}
                </span>
                <span className="modal-trend">
                  {currentData[selectedWidget]?.trend || 'N/A'}
                </span>
              </div>
              <div className="modal-details">
                <h3>Análisis Detallado</h3>
                <p>Aquí se mostrarían gráficos y métricas más detalladas para {selectedWidget}.</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Chat de IA */}
      {showAIChat && (
        <div className="ai-chat-overlay" onClick={() => setShowAIChat(false)}>
          <motion.div
            className="ai-chat-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="chat-header">
              <div className="chat-avatar">
                <FaRobot />
                <div className="avatar-pulse" />
              </div>
              <div className="chat-info">
                <h3>Neural AI</h3>
                <p>Tu asistente personal</p>
              </div>
              <button className="chat-close" onClick={() => setShowAIChat(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="chat-messages">
              <div className="message ai">
                <div className="message-avatar">
                  <FaRobot />
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    <div className="ai-sparkle">✨</div>
                    ¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?
                  </div>
                  <div className="message-time">Ahora</div>
                </div>
              </div>
            </div>
            
            <div className="chat-input">
              <div className="input-wrapper">
                <input
                  type="text"
                  className="chat-input-field"
                  placeholder="Escribe tu mensaje..."
                />
                <button className="voice-btn">
                  <FaMicrophone />
                </button>
                <button className="send-btn">
                  <FaShare />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Editar Perfil */}
      {showEditModal && (
        <div className="edit-profile-overlay" onClick={closeEditModal}>
          <motion.div
            className="edit-profile-modal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Editar Perfil</h2>
              <button className="modal-close" onClick={closeEditModal}>
                <FaTimes />
              </button>
            </div>
                         <div className="modal-content">
               {/* Avatar Section */}
               <div className="avatar-section">
                 <h3>Foto de Perfil</h3>
                 <div className="avatar-upload-container">
                   <div className="avatar-preview">
                     {editData.avatar ? (
                       <img 
                         src={editData.avatar} 
                         alt="Avatar preview"
                         onError={(e) => {
                           e.target.style.display = 'none';
                           e.target.nextSibling.style.display = 'flex';
                         }}
                       />
                     ) : null}
                     <div className="avatar-placeholder" style={{display: editData.avatar ? 'none' : 'flex'}}>
                       <FaUser />
                     </div>
                     <button className="avatar-edit-overlay" onClick={openFileSelector}>
                       <FaCamera />
                       <span>Cambiar</span>
                     </button>
                   </div>
                   <div className="avatar-info">
                     <p>Formatos: JPG, PNG, GIF</p>
                     <p>Máximo: 5MB</p>
                   </div>
                 </div>
               </div>

               <div className="profile-info">
                <div className="profile-field">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                  />
                </div>
                <div className="profile-field">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleEditChange('email', e.target.value)}
                  />
                </div>
                <div className="profile-field">
                  <label>Teléfono:</label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleEditChange('phone', e.target.value)}
                  />
                </div>
                <div className="profile-field">
                  <label>Ubicación:</label>
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => handleEditChange('location', e.target.value)}
                  />
                </div>
                <div className="profile-field">
                  <label>Sitio Web:</label>
                  <input
                    type="url"
                    value={editData.website}
                    onChange={(e) => handleEditChange('website', e.target.value)}
                  />
                </div>
                <div className="profile-field">
                  <label>Bio:</label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) => handleEditChange('bio', e.target.value)}
                  />
                </div>
                <div className="profile-field">
                  <label>Fecha de Nacimiento:</label>
                  <input
                    type="date"
                    value={editData.birthday}
                    onChange={(e) => handleEditChange('birthday', e.target.value)}
                  />
                </div>
                <div className="profile-field">
                  <label>Género:</label>
                  <select
                    value={editData.gender}
                    onChange={(e) => handleEditChange('gender', e.target.value)}
                  >
                    <option value="No especificado">No especificado</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="profile-field">
                  <label>Dirección de Wallet:</label>
                  <input
                    type="text"
                    value={editData.walletAddress}
                    onChange={(e) => handleEditChange('walletAddress', e.target.value)}
                  />
                </div>
                <div className="profile-field">
                  <label>Fecha de Registro:</label>
                  <input
                    type="text"
                    value={editData.joinDate}
                    onChange={(e) => handleEditChange('joinDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="preferences-section">
                <h3>Preferencias</h3>
                <div className="preference-item">
                  <FaBell />
                  <span>Notificaciones</span>
                  <input
                    type="checkbox"
                    checked={editData.preferences.notifications}
                    onChange={() => handleEditPreferenceChange('notifications')}
                  />
                </div>
                <div className="preference-item">
                  <FaGlobe />
                  <span>Boletín Informativo</span>
                  <input
                    type="checkbox"
                    checked={editData.preferences.newsletter}
                    onChange={() => handleEditPreferenceChange('newsletter')}
                  />
                </div>
                <div className="preference-item">
                  <FaChartLine />
                  <span>Análisis de Datos</span>
                  <input
                    type="checkbox"
                    checked={editData.preferences.analytics}
                    onChange={() => handleEditPreferenceChange('analytics')}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="save-btn" 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="spinner" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Guardar Cambios
                    </>
                  )}
                </button>
                {saveSuccess && (
                  <div className="save-success-message">
                    <FaCheckCircle />
                    Perfil actualizado con éxito!
                  </div>
                )}
                {saveError && (
                  <div className="save-error-message">
                    <FaExclamationTriangle />
                    Error: {saveError}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage; 