import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/create-event.css';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaClock, 
  FaTag, 
  FaCamera, 
  FaTicketAlt,
  FaChevronLeft, 
  FaChevronRight,
  FaCheck,
  FaUpload,
  FaTimes,
  FaEye,
  FaWallet,
  FaGlobe,
  FaShieldAlt,
  FaExchangeAlt,
  FaGavel,
  FaCreditCard,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaInfoCircle
} from 'react-icons/fa';

const CreateEventPage = ({ isEditing = false, eventToEdit = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    // Básicos
    title: '',
    description: '',
    category: '',
    
    // Fecha y tiempo
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    timezone: 'America/Mexico_City',
    
    // Ubicación
    locationType: 'physical',
    venue: '',
    address: '',
    city: '',
    country: 'México',
    virtualLink: '',
    
    // Ticketing
    ticketType: 'free',
    price: '',
    currency: 'ETH',
    totalTickets: '',
    
    // Métodos de pago
    paymentMethods: {
      crypto: true,
      card: false
    },
    
    // Opciones de pago (solo para eventos de pago)
    allowResale: true,
    allowAuction: true,
    resalePrices: {
      ETH: { min: '', max: '' },
      MATIC: { min: '', max: '' },
      MXN: { min: '', max: '' },
      USD: { min: '', max: '' }
    },
    auctionPrices: {
      ETH: { min: '', max: '' },
      MATIC: { min: '', max: '' },
      MXN: { min: '', max: '' },
      USD: { min: '', max: '' }
    },
    
    // Configuración
    isPrivate: false,
    requiresApproval: false,
    
    // Media
    coverImage: null
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const totalSteps = 5;

  // Cargar datos del evento a editar
  useEffect(() => {
    if (isEditing && eventToEdit) {
      setFormData({
        ...formData,
        ...eventToEdit,
        // Asegurar que los campos anidados se copien correctamente
        paymentMethods: eventToEdit.paymentMethods || { crypto: true, card: false },
        resalePrices: eventToEdit.resalePrices || { ETH: { min: '', max: '' }, MATIC: { min: '', max: '' }, MXN: { min: '', max: '' }, USD: { min: '', max: '' } },
        auctionPrices: eventToEdit.auctionPrices || { ETH: { min: '', max: '' }, MATIC: { min: '', max: '' }, MXN: { min: '', max: '' }, USD: { min: '', max: '' } }
      });
      
      // Si hay imagen, establecer preview
      if (eventToEdit.coverImage) {
        setImagePreview(eventToEdit.coverImage);
      }
      
      showNotification('success', 'Modo edición activado. Puedes modificar los datos del evento.');
    }
  }, [isEditing, eventToEdit]);

  // Función para mostrar notificaciones
  const showNotification = useCallback((type, message, duration = 5000) => {
    if (type === 'success') {
      setSuccessMessage(message);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), duration);
    } else {
      setErrorMessage(message);
      setShowError(true);
      setTimeout(() => setShowError(false), duration);
    }
  }, []);

  // Función para limpiar notificaciones
  const clearNotifications = useCallback(() => {
    setShowSuccess(false);
    setShowError(false);
  }, []);

  // Definir las monedas disponibles
  const currencies = [
    { id: 'ETH', name: 'Ethereum', symbol: 'ETH', step: '0.001' },
    { id: 'MATIC', name: 'Polygon', symbol: 'MATIC', step: '1' },
    { id: 'MXN', name: 'Peso Mexicano', symbol: 'MXN', step: '1' },
    { id: 'USD', name: 'US Dollar', symbol: 'USD', step: '0.01' }
  ];

  const steps = [
    { id: 1, title: 'Información Básica', icon: <FaCalendarAlt /> },
    { id: 2, title: 'Fecha & Ubicación', icon: <FaMapMarkerAlt /> },
    { id: 3, title: 'Configuración de Tickets', icon: <FaTicketAlt /> },
    { id: 4, title: 'Multimedia', icon: <FaCamera /> },
    { id: 5, title: 'Configuración Final', icon: <FaShieldAlt /> }
  ];

  const handleStepClick = useCallback((stepId) => {
    setCurrentStep(stepId);
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Si cambia a evento gratuito, deshabilitar reventa y subasta
      if (field === 'ticketType' && value === 'free') {
        updated.allowResale = false;
        updated.allowAuction = false;
      }
      
      // Si cambia a evento de pago, habilitar reventa y subasta por defecto
      if (field === 'ticketType' && value === 'paid') {
        updated.allowResale = true;
        updated.allowAuction = true;
      }
      
      return updated;
    });
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Función para determinar qué campos mostrar según el tipo de evento
  const getVisibleFields = useCallback(() => {
    const fields = {
      // Campos básicos siempre visibles
      basic: ['title', 'description', 'category'],
      dateTime: ['startDate', 'startTime', 'endDate', 'endTime'],
      
      // Campos de ubicación según tipo
      location: formData.locationType === 'physical' 
        ? ['venue', 'address', 'city', 'country']
        : formData.locationType === 'virtual'
        ? ['virtualLink']
        : ['venue', 'address', 'city', 'country', 'virtualLink'], // híbrido
      
      // Campos de ticketing según tipo
      ticketing: ['totalTickets'],
      
      // Campos de pago solo para eventos pagados
      payment: formData.ticketType === 'paid' 
        ? ['price', 'currency', 'paymentMethods', 'allowResale', 'allowAuction']
        : [],
      
      // Campos de configuración
      config: ['isPrivate', 'requiresApproval'],
      
      // Media siempre visible
      media: ['coverImage']
    };

    return fields;
  }, [formData.locationType, formData.ticketType]);

  // Función para validar campos según tipo de evento
  const validateForm = useCallback(() => {
    const newErrors = {};
    const visibleFields = getVisibleFields();
    
    // Validar campos básicos
    if (!formData.title?.trim()) newErrors.title = 'El título es requerido';
    if (!formData.description?.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.category) newErrors.category = 'Selecciona una categoría';
    if (!formData.startDate) newErrors.startDate = 'Fecha de inicio requerida';
    if (!formData.startTime) newErrors.startTime = 'Hora de inicio requerida';
    
    // Validar ubicación según tipo
    if (formData.locationType === 'physical') {
      if (!formData.venue?.trim()) newErrors.venue = 'El lugar es requerido';
      if (!formData.address?.trim()) newErrors.address = 'La dirección es requerida';
      if (!formData.city?.trim()) newErrors.city = 'La ciudad es requerida';
    } else if (formData.locationType === 'virtual') {
      if (!formData.virtualLink?.trim()) newErrors.virtualLink = 'El enlace virtual es requerido';
    } else if (formData.locationType === 'hybrid') {
      if (!formData.venue?.trim()) newErrors.venue = 'El lugar es requerido';
      if (!formData.virtualLink?.trim()) newErrors.virtualLink = 'El enlace virtual es requerido';
    }
    
    // Validar ticketing
    if (!formData.totalTickets || isNaN(formData.totalTickets) || formData.totalTickets <= 0) {
      newErrors.totalTickets = 'La cantidad de tickets debe ser mayor a 0';
    }
    
    // Validar campos de pago solo para eventos pagados
    if (formData.ticketType === 'paid') {
      if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
        newErrors.price = 'El precio debe ser mayor a 0';
      }
      
      // Validar que al menos un método de pago esté seleccionado
      if (!formData.paymentMethods.crypto && !formData.paymentMethods.card) {
        newErrors.paymentMethods = 'Debes seleccionar al menos un método de pago';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, getVisibleFields]);

  const handleSubmit = useCallback(() => {
    if (validateForm()) {
      setIsSubmitting(true);
      const eventData = {
        ...formData,
        // Asegurar que los eventos gratuitos no tengan opciones de mercado secundario
        allowResale: formData.ticketType === 'paid' ? formData.allowResale : false,
        allowAuction: formData.ticketType === 'paid' ? formData.allowAuction : false,
        // Inicializar estados actuales como false (se activarán después)
        hasResale: false,
        hasAuction: false,
        // Agregar precios límite para mercado secundario
        resalePrices: formData.ticketType === 'paid' && formData.allowResale ? formData.resalePrices : { ETH: { min: null, max: null }, MATIC: { min: null, max: null }, MXN: { min: null, max: null }, USD: { min: null, max: null } },
        auctionPrices: formData.ticketType === 'paid' && formData.allowAuction ? formData.auctionPrices : { ETH: { min: null, max: null }, MATIC: { min: null, max: null }, MXN: { min: null, max: null }, USD: { min: null, max: null } },
        // Configuración de métodos de pago
        paymentMethods: formData.ticketType === 'paid' ? formData.paymentMethods : { crypto: false, card: false }
      };
      
      console.log(isEditing ? 'Actualizar evento:' : 'Crear evento:', eventData);
      
      // Simular tiempo de respuesta del backend
      setTimeout(() => {
        setIsSubmitting(false);
        const message = isEditing 
          ? 'Evento actualizado exitosamente!' 
          : 'Evento creado exitosamente!';
        showNotification('success', message);
        
        // Si es edición, redirigir al perfil después de un delay
        if (isEditing) {
          setTimeout(() => {
            window.location.href = '/perfil';
          }, 2000);
        }
      }, 2000);
    } else {
      showNotification('error', 'Por favor, completa todos los campos correctamente.');
    }
  }, [formData, validateForm, showNotification, isEditing]);

  const renderProgressBar = () => (
    <div className="create-event-progress">
      <div className="progress-steps">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className="progress-step-container"
            onClick={() => handleStepClick(step.id)}
            style={{ cursor: 'pointer' }}
          >
            <motion.div
              className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="step-icon">{step.icon}</div>
              <span className="step-number">{step.id}</span>
            </motion.div>
            <div className="step-label">{step.title}</div>
            {index < steps.length - 1 && (
              <div className={`progress-line ${currentStep > step.id ? 'completed' : ''}`} />
            )}
          </div>
        ))}
      </div>
      <div className="progress-bar-container">
        <motion.div 
          className="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );

  const categories = [
    'Música', 'Arte & Cultura', 'Deportes', 'Tecnología', 'Negocios', 
    'Gastronomía', 'Entretenimiento', 'Educación', 'Networking', 'Otro'
  ];

  const blockchains = [
    { id: 'ethereum', name: 'Ethereum', color: '#627EEA', currency: 'ETH' },
    { id: 'polygon', name: 'Polygon', color: '#8247E5', currency: 'MATIC' },
    { id: 'arbitrum', name: 'Arbitrum', color: '#28A0F0', currency: 'ETH' },
    { id: 'optimism', name: 'Optimism', color: '#FF0420', currency: 'ETH' }
  ];

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="form-step"
          >
            <div className="step-header">
              <h2>Información Básica del Evento</h2>
              <p>Comencemos con los detalles principales de tu evento</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Título del Evento *</label>
                <motion.input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="ej. Concierto de Rock en el Palacio de los Deportes"
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  whileFocus={{ scale: 1.02 }}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group full-width">
                <label>Descripción *</label>
                <motion.textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe tu evento, qué pueden esperar los asistentes..."
                  rows="4"
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  whileFocus={{ scale: 1.02 }}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              <div className="form-group">
                <label>Categoría *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`form-select ${errors.category ? 'error' : ''}`}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="form-step"
          >
            <div className="step-header">
              <h2>Fecha, Hora y Ubicación</h2>
              <p>¿Cuándo y dónde se realizará tu evento?</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Fecha de Inicio *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`form-input ${errors.startDate ? 'error' : ''}`}
                />
                {errors.startDate && <span className="error-message">{errors.startDate}</span>}
              </div>

              <div className="form-group">
                <label>Hora de Inicio *</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className={`form-input ${errors.startTime ? 'error' : ''}`}
                />
                {errors.startTime && <span className="error-message">{errors.startTime}</span>}
              </div>

              <div className="form-group">
                <label>Fecha de Fin</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Hora de Fin</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group full-width">
                <label>Tipo de Ubicación</label>
                <div className="location-type-selector">
                  {['physical', 'virtual', 'hybrid'].map(type => (
                    <motion.button
                      key={type}
                      type="button"
                      className={`location-option ${formData.locationType === type ? 'active' : ''}`}
                      onClick={() => handleInputChange('locationType', type)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="option-icon">
                        {type === 'physical' && <FaMapMarkerAlt />}
                        {type === 'virtual' && <FaGlobe />}
                        {type === 'hybrid' && <FaUsers />}
                      </span>
                      <span>
                        {type === 'physical' && 'Presencial'}
                        {type === 'virtual' && 'Virtual'}
                        {type === 'hybrid' && 'Híbrido'}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {(formData.locationType === 'physical' || formData.locationType === 'hybrid') && (
                <>
                  <div className="form-group full-width">
                    <label>Lugar/Venue *</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => handleInputChange('venue', e.target.value)}
                      placeholder="ej. Palacio de los Deportes"
                      className={`form-input ${errors.venue ? 'error' : ''}`}
                    />
                    {errors.venue && <span className="error-message">{errors.venue}</span>}
                  </div>

                  <div className="form-group">
                    <label>Dirección</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Dirección completa"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Ciudad</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Ciudad"
                      className="form-input"
                    />
                  </div>
                </>
              )}

              {(formData.locationType === 'virtual' || formData.locationType === 'hybrid') && (
                <div className="form-group full-width">
                  <label>Enlace Virtual *</label>
                  <input
                    type="url"
                    value={formData.virtualLink}
                    onChange={(e) => handleInputChange('virtualLink', e.target.value)}
                    placeholder="https://zoom.us/j/..."
                    className={`form-input ${errors.virtualLink ? 'error' : ''}`}
                  />
                  {errors.virtualLink && <span className="error-message">{errors.virtualLink}</span>}
                </div>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="form-step"
          >
            <div className="step-header">
              <h2>Configuración de Tickets</h2>
              <p>Define el precio y disponibilidad de tus tickets</p>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label>Tipo de Ticket</label>
                <div className="ticket-type-selector">
                  <motion.button
                    type="button"
                    className={`ticket-option ${formData.ticketType === 'free' ? 'active' : ''}`}
                    onClick={() => handleInputChange('ticketType', 'free')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTag />
                    <span>Gratis</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    className={`ticket-option ${formData.ticketType === 'paid' ? 'active' : ''}`}
                    onClick={() => handleInputChange('ticketType', 'paid')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaCreditCard />
                    <span>De Pago</span>
                  </motion.button>
                </div>
              </div>

              <div className="form-group">
                <label>Cantidad de Tickets *</label>
                <input
                  type="number"
                  value={formData.totalTickets}
                  onChange={(e) => handleInputChange('totalTickets', e.target.value)}
                  placeholder="ej. 100"
                  min="1"
                  className={`form-input ${errors.totalTickets ? 'error' : ''}`}
                />
                {errors.totalTickets && <span className="error-message">{errors.totalTickets}</span>}
              </div>

              {/* Campos de pago solo para eventos pagados */}
              {formData.ticketType === 'paid' && (
                <>
                  <div className="form-group">
                    <label>Precio *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`form-input ${errors.price ? 'error' : ''}`}
                    />
                    {errors.price && <span className="error-message">{errors.price}</span>}
                  </div>

                  <div className="form-group">
                    <label>Moneda</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="form-select"
                    >
                      {currencies.map(currency => (
                        <option key={currency.id} value={currency.id}>
                          {currency.name} ({currency.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Métodos de Pago</label>
                    <div className="payment-methods">
                      <motion.label className="payment-method">
                        <input
                          type="checkbox"
                          checked={formData.paymentMethods.crypto}
                          onChange={(e) => handleInputChange('paymentMethods', {
                            ...formData.paymentMethods,
                            crypto: e.target.checked
                          })}
                        />
                        <FaWallet />
                        <span>Criptomonedas</span>
                      </motion.label>
                      <motion.label className="payment-method">
                        <input
                          type="checkbox"
                          checked={formData.paymentMethods.card}
                          onChange={(e) => handleInputChange('paymentMethods', {
                            ...formData.paymentMethods,
                            card: e.target.checked
                          })}
                        />
                        <FaCreditCard />
                        <span>Tarjeta de Crédito</span>
                      </motion.label>
                    </div>
                    {errors.paymentMethods && <span className="error-message">{errors.paymentMethods}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label>Opciones de Mercado Secundario</label>
                    <div className="secondary-market-options">
                      <motion.label className="market-option">
                        <input
                          type="checkbox"
                          checked={formData.allowResale}
                          onChange={(e) => handleInputChange('allowResale', e.target.checked)}
                        />
                        <FaExchangeAlt />
                        <span>Permitir Reventa</span>
                      </motion.label>
                      <motion.label className="market-option">
                        <input
                          type="checkbox"
                          checked={formData.allowAuction}
                          onChange={(e) => handleInputChange('allowAuction', e.target.checked)}
                        />
                        <FaGavel />
                        <span>Permitir Subastas</span>
                      </motion.label>
                    </div>
                  </div>
                </>
              )}

              {/* Mensaje informativo para eventos gratuitos */}
              {formData.ticketType === 'free' && (
                <div className="form-group full-width">
                  <div className="info-message">
                    <FaInfoCircle />
                    <span>Los eventos gratuitos no incluyen opciones de mercado secundario ni métodos de pago.</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="form-step"
          >
            <div className="step-header">
              <h2>Multimedia</h2>
              <p>Agrega imágenes para hacer tu evento más atractivo</p>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label>Imagen de Portada</label>
                <div 
                  className="image-upload-area"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <div className="image-overlay">
                        <FaCamera />
                        <span>Cambiar imagen</span>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <FaUpload />
                      <span>Subir imagen de portada</span>
                      <small>JPG, PNG o WebP (máx. 5MB)</small>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="form-step"
          >
            <div className="step-header">
              <h2>Configuración Final</h2>
              <p>Últimos ajustes antes de publicar tu evento</p>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <div className="config-options">
                  <motion.div 
                    className="config-option"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="option-content">
                      <div className="option-header">
                        <FaEye />
                        <span>Evento Privado</span>
                      </div>
                      <small>Solo visible para invitados con enlace directo</small>
                    </div>
                    <motion.button
                      type="button"
                      className={`toggle-switch ${formData.isPrivate ? 'active' : ''}`}
                      onClick={() => handleInputChange('isPrivate', !formData.isPrivate)}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div 
                        className="toggle-thumb"
                        animate={{ x: formData.isPrivate ? 24 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </motion.div>

                  <motion.div 
                    className="config-option"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="option-content">
                      <div className="option-header">
                        <FaShieldAlt />
                        <span>Requiere Aprobación</span>
                      </div>
                      <small>Revisar solicitudes antes de confirmar asistencia</small>
                    </div>
                    <motion.button
                      type="button"
                      className={`toggle-switch ${formData.requiresApproval ? 'active' : ''}`}
                      onClick={() => handleInputChange('requiresApproval', !formData.requiresApproval)}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div 
                        className="toggle-thumb"
                        animate={{ x: formData.requiresApproval ? 24 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </motion.div>
                </div>
              </div>

              <div className="form-group full-width">
                <div className="event-summary">
                  <h3>Resumen del Evento</h3>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">Título:</span>
                      <span className="summary-value">{formData.title || 'Sin título'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Fecha:</span>
                      <span className="summary-value">{formData.startDate || 'Sin fecha'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Precio:</span>
                      <span className="summary-value">
                        {formData.ticketType === 'free' ? 'Gratis' : `${formData.price || '0'} ${formData.currency || 'ETH'}`}
                      </span>
                    </div>
                    {formData.ticketType === 'paid' && (
                      <>
                        <div className="summary-item">
                          <span className="summary-label">Reventa:</span>
                          <span className="summary-value">
                            {formData.allowResale ? '✅ Permitida' : '❌ No permitida'}
                          </span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">Subastas:</span>
                          <span className="summary-value">
                            {formData.allowAuction ? '✅ Permitidas' : '❌ No permitidas'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="create-event-page">
      {/* Notificaciones Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="toast-notification success"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <FaCheckCircle className="toast-icon" />
            <span className="toast-message">{successMessage}</span>
            <button 
              className="toast-close" 
              onClick={() => setShowSuccess(false)}
            >
              <FaTimes />
            </button>
          </motion.div>
        )}

        {showError && (
          <motion.div
            className="toast-notification error"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <FaExclamationTriangle className="toast-icon" />
            <span className="toast-message">{errorMessage}</span>
            <button 
              className="toast-close" 
              onClick={() => setShowError(false)}
            >
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="create-event-container">
        <motion.div
          className="create-event-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="create-event-header">
            <h1>{isEditing ? 'Editar Evento' : 'Crear Nuevo Evento'}</h1>
            <p>{isEditing ? 'Modifica los datos de tu evento' : 'Crea tu evento en blockchain de forma fácil y segura'}</p>
          </div>

          {renderProgressBar()}

          <div className="form-content">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>

          <div className="form-navigation">
            <motion.button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="nav-button prev"
              whileHover={{ scale: currentStep > 1 ? 1.05 : 1 }}
              whileTap={{ scale: currentStep > 1 ? 0.95 : 1 }}
            >
              <FaChevronLeft />
              Anterior
            </motion.button>

            {currentStep < totalSteps ? (
              <motion.button
                type="button"
                onClick={nextStep}
                className="nav-button next"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Siguiente
                <FaChevronRight />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`nav-button submit ${isSubmitting ? 'loading' : ''}`}
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spinner" />
                    {isEditing ? 'Actualizando...' : 'Creando...'}
                  </>
                ) : (
                  <>
                    <FaCheck />
                    {isEditing ? 'Actualizar Evento' : 'Crear Evento'}
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateEventPage; 