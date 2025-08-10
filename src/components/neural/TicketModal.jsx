import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaEthereum,
  FaWallet,
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaCheckCircle,
  FaInfoCircle,
  FaShieldAlt,
  FaUsers,
  FaCreditCard,
  FaLock,
  FaCalendar,
  FaExchangeAlt,
  FaGavel,
  FaUniversity,
  FaQrcode,
  FaCopy,
  FaMoneyCheckAlt,
  FaBarcode,
  FaStore,
  FaDownload,
  FaShareAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckDouble
} from 'react-icons/fa';
import { SiPolygon, SiVisa, SiMastercard, SiStripe, SiMercadopago, SiKlarna } from 'react-icons/si';
import '../../styles/ticket-modal.css';

const TicketModal = ({ isOpen, onClose, event }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedBlockchain, setSelectedBlockchain] = useState('ETH');
  const [paymentMethod, setPaymentMethod] = useState('crypto'); // 'crypto' or 'card' or 'spei' or 'dimo' or 'oxxo' or 'mercadopago' or 'kueski'
  const [selectedCurrency, setSelectedCurrency] = useState('USD'); // 'USD' or 'MXN'
  const [currentStep, setCurrentStep] = useState('details'); // details, checkout, confirmation, ticket
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseType, setPurchaseType] = useState('official'); // 'official', 'resale', 'auction'
  const [generatedTicket, setGeneratedTicket] = useState(null);
  
  // Estados para formulario de tarjeta
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    email: '',
    phone: ''
  });

  // Estados de loading mejorados
  const [loadingStep, setLoadingStep] = useState(''); // 'validating', 'processing', 'minting', 'confirming'
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log('Modal abierto con evento:', event);
      document.body.style.overflow = 'hidden';
      // Resetear estados al abrir el modal
      setCurrentStep('details');
      setIsProcessing(false);
      setLoadingStep('');
      setLoadingMessage('');
      setLoadingProgress(0);
      setErrorMessage('');
      setShowError(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, event]);

  if (!event) {
    console.log('No hay evento disponible');
    return null;
  }

  // Función para simular progreso de loading
  const simulateProgress = (step, message, duration = 2000) => {
    setLoadingStep(step);
    setLoadingMessage(message);
    setLoadingProgress(0);
    
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            resolve();
            return 100;
          }
          return prev + 10;
        });
      }, duration / 10);
    });
  };

  // Función para mostrar error
  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage('');
    }, 5000);
  };

  const blockchainOptions = [
    { 
      id: 'ETH', 
      name: 'Ethereum', 
      icon: <FaEthereum />, 
      price: event.cryptoPrices?.ETH || '0.8 ETH',
      gasEstimate: '~$12 gas',
      color: '#627eea'
    },
    { 
      id: 'MATIC', 
      name: 'Polygon', 
      icon: <SiPolygon />, 
      price: event.cryptoPrices?.MATIC || '1,200 MATIC',
      gasEstimate: '~$0.05 gas',
      color: '#8247e5'
    },
    { 
      id: 'ARB', 
      name: 'Arbitrum', 
      icon: '◉', 
      price: event.cryptoPrices?.ARB || '0.85 ETH',
      gasEstimate: '~$1.5 gas',
      color: '#28a0f0'
    },
    { 
      id: 'OP', 
      name: 'Optimism', 
      icon: '🔴', 
      price: event.cryptoPrices?.OP || '0.82 ETH',
      gasEstimate: '~$2 gas',
      color: '#ff0420'
    }
  ];

  // Precios en diferentes monedas
  const priceUSD = event.priceUSD || 85;
  const priceMXN = event.priceMXN || (priceUSD * 18.5); // Tipo de cambio aproximado USD a MXN
  const exchangeRate = 18.5; // 1 USD = 18.5 MXN aproximadamente

  const selectedChain = blockchainOptions.find(chain => chain.id === selectedBlockchain);
  
  // Obtener el precio base según el tipo de compra
  const getBasePrice = () => {
    let price;
    switch (purchaseType) {
      case 'resale':
        price = event.resalePrice || event.price;
        break;
      case 'auction':
        price = event.currentBid || event.price;
        break;
      case 'official':
      default:
        price = event.price;
    }
    // Asegurarse de que el precio sea un string
    return price ? price.toString() : '0';
  };

  // Obtener la moneda según el tipo de compra
  const getCurrency = () => {
    switch (purchaseType) {
      case 'resale':
        return event.resaleCurrency || event.currency;
      case 'auction':
        return event.auctionCurrency || event.currency;
      case 'official':
      default:
        return event.currency;
    }
  };
  
  // Calcular precio total para crypto incluyendo comisiones
  const getCryptoTotal = () => {
    if (!selectedChain) return '';
    
    try {
      const priceString = getBasePrice();
      const basePrice = parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;
    const commission = basePrice * 0.003; // 0.3%
    const totalPerTicket = basePrice + commission;
      const currency = getCurrency();
    const finalTotal = (totalPerTicket * selectedQuantity).toFixed(currency === 'MATIC' ? 2 : 4);
    return `${finalTotal} ${currency}`;
    } catch (error) {
      console.error('Error calculando el precio total:', error);
      return '0 ETH';
    }
  };
  
  const totalPrice = selectedChain ? getCryptoTotal() : '';
  
  // Precios totales según la moneda seleccionada
  const getCurrentPrice = () => {
    const price = selectedCurrency === 'USD' ? priceUSD : priceMXN;
    return selectedCurrency === 'MXN' ? parseFloat(price.toFixed(2)) : price;
  };

  const getTotalPrice = () => {
    const total = selectedQuantity * getCurrentPrice();
    return selectedCurrency === 'MXN' ? parseFloat(total.toFixed(2)) : total;
  };

  const getProcessingFee = () => {
    if (paymentMethod === 'crypto') {
      // 0.3% para pagos con criptomonedas
      const cryptoPrice = parseFloat(selectedChain?.price.replace(/[^0-9.]/g, '')) || 0;
      return parseFloat((cryptoPrice * 0.003).toFixed(4));
    } else {
      // 1% para pagos con tarjeta (máximo)
      const basePrice = getCurrentPrice();
      return parseFloat((basePrice * 0.01).toFixed(2));
    }
  };

  const getCurrencySymbol = () => {
    return selectedCurrency === 'USD' ? '$' : '$';
  };

  const getCurrencyCode = () => {
    return selectedCurrency;
  };

  const handleCardInputChange = (field, value) => {
    if (field === 'cardNumber') {
      // Formatear número de tarjeta
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      value = value.slice(0, 19); // Máximo 16 dígitos + 3 espacios
    } else if (field === 'expiryDate') {
      // Formatear fecha MM/YY
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
    } else if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    } else if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isCardDataValid = () => {
    return cardData.cardNumber.replace(/\s/g, '').length === 16 &&
           cardData.expiryDate.length === 5 &&
           cardData.cvv.length >= 3 &&
           cardData.cardHolder.trim().length > 0 &&
           cardData.email.includes('@') &&
           cardData.phone.length >= 10;
  };

  // Función para generar ticket NFT mock
  const generateTicketNFT = () => {
    const ticketId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const contractAddress = '0x' + Math.random().toString(16).substr(2, 40);
    const tokenId = Math.floor(Math.random() * 1000000);
    
    return {
      id: ticketId,
      tokenId: tokenId,
      contractAddress: contractAddress,
      blockchain: selectedBlockchain,
      eventTitle: event.title,
      eventDate: event.date,
      eventLocation: event.location,
      ticketType: 'VIP',
      seatNumber: selectedQuantity > 1 ? `${Math.floor(Math.random() * 100)}A-${Math.floor(Math.random() * 100)}Z` : `${Math.floor(Math.random() * 100)}A`,
      price: paymentMethod === 'crypto' ? totalPrice : `${getCurrencySymbol()}${(getTotalPrice() + getProcessingFee()).toFixed(2)}`,
      purchaseDate: new Date().toISOString(),
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketId}`,
      image: event.image,
      owner: '0x' + Math.random().toString(16).substr(2, 40),
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64)
    };
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    setShowError(false);
    setErrorMessage('');
    
    try {
      // Paso 1: Validación
      await simulateProgress('validating', 'Validando información de pago...', 1500);
      
      // Paso 2: Procesamiento de pago
      await simulateProgress('processing', 'Procesando transacción...', 2000);
      
      // Simular posible error (10% de probabilidad)
      if (Math.random() < 0.1) {
        throw new Error('Error en la transacción. Por favor, intenta nuevamente.');
      }
      
      // Paso 3: Minting NFT
      await simulateProgress('minting', 'Creando ticket NFT...', 2500);
      
      // Paso 4: Confirmación en blockchain
      await simulateProgress('confirming', 'Confirmando en blockchain...', 1500);
      
      // Generar ticket NFT
      const ticket = generateTicketNFT();
      setGeneratedTicket(ticket);
      
      // Ir al paso de confirmación
      setCurrentStep('confirmation');
    } catch (error) {
      console.error('Error en la compra:', error);
      showErrorMessage(error.message || 'Error en la transacción. Por favor, intenta nuevamente.');
    } finally {
      setIsProcessing(false);
      setLoadingStep('');
      setLoadingMessage('');
      setLoadingProgress(0);
    }
  };

  const handleViewTicket = () => {
    if (currentStep === 'confirmation') {
      setCurrentStep('ticket');
    } else if (currentStep === 'ticket') {
      setCurrentStep('details');
    }
  };

  const handleDownloadTicket = () => {
    // Simular descarga del ticket
    const link = document.createElement('a');
    link.href = generatedTicket.qrCode;
    link.download = `ticket-${generatedTicket.id}.png`;
    link.click();
  };

  const handleShareTicket = () => {
    // Simular compartir ticket
    if (navigator.share) {
      navigator.share({
        title: `Mi ticket para ${generatedTicket.eventTitle}`,
        text: `¡Compré mi ticket NFT para ${generatedTicket.eventTitle}!`,
        url: window.location.href
      });
    } else {
      // Fallback: copiar al clipboard
      navigator.clipboard.writeText(`¡Compré mi ticket NFT para ${generatedTicket.eventTitle}!`);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const paymentOptions = [
    { key: 'crypto', label: 'Criptomonedas', icon: <FaWallet /> },
    { key: 'card', label: 'Tarjeta', icon: <FaCreditCard /> },
    { key: 'spei', label: 'SPEI', icon: <FaUniversity /> },
    { key: 'oxxo', label: 'Efectivo (OXXO/7-Eleven)', icon: <FaStore /> },
    { key: 'mercadopago', label: 'Mercado Pago', icon: <SiMercadopago /> },
    { key: 'kueski', label: 'Kueski Pay', icon: <SiKlarna style={{color:'#00e084'}}/> },
    { key: 'dimo', label: 'Dimo', icon: <FaQrcode /> },
  ];

  // Copiar al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Determinar las opciones habilitadas para este ticket
  const purchaseOptions = [];
  if (!event.allowResale && !event.allowAuction) {
    purchaseOptions.push('official');
  }
  if (event.allowResale && event.resalePrice) {
    purchaseOptions.push('resale');
  }
  if (event.allowAuction && event.currentBid) {
    purchaseOptions.push('auction');
  }

  // Si solo hay una opción, selecciónala automáticamente
  useEffect(() => {
    if (purchaseOptions.length === 1) {
      setPurchaseType(purchaseOptions[0]);
    }
  }, [event, isOpen]);

  // Renderizar solo las opciones habilitadas
  const renderPurchaseOptions = () => (
    <div className="purchase-options">
      {/* Venta Oficial */}
      {purchaseOptions.includes('official') && (
        <div 
          className={`purchase-option official ${purchaseType === 'official' ? 'selected' : ''}`}
          onClick={() => purchaseOptions.length > 1 && setPurchaseType('official')}
        >
          <div className="option-header">
            <div className="option-title">
              <FaShoppingCart className="option-icon" />
              <span>Venta Oficial</span>
            </div>
            <div className="option-price">
              {event.currency === 'ETH' && <FaEthereum className="currency-icon" />}
              {event.currency === 'MATIC' && <SiPolygon className="currency-icon" />}
              <span>{event.price} {event.currency}</span>
            </div>
          </div>
          <div className="option-details">
            <span className="availability">{event.availableTickets} tickets disponibles</span>
          </div>
        </div>
      )}
      {/* Reventa */}
      {purchaseOptions.includes('resale') && (
        <div 
          className={`purchase-option resale ${purchaseType === 'resale' ? 'selected' : ''}`}
          onClick={() => purchaseOptions.length > 1 && setPurchaseType('resale')}
        >
          <div className="option-header">
            <div className="option-title">
              <FaExchangeAlt className="option-icon" />
              <span>Mercado de Reventa</span>
            </div>
            <div className="option-price">
              {event.resaleCurrency === 'ETH' && <FaEthereum className="currency-icon" />}
              {event.resaleCurrency === 'MATIC' && <SiPolygon className="currency-icon" />}
              <span>{event.resalePrice} {event.resaleCurrency}</span>
            </div>
          </div>
          <div className="option-details">
            <span className="availability">{event.resaleAvailable} tickets en reventa</span>
            <span className="premium">+{Math.round(((event.resalePrice - event.price) / event.price) * 100)}% sobre precio original</span>
          </div>
        </div>
      )}
      {/* Subasta */}
      {purchaseOptions.includes('auction') && (
        <div 
          className={`purchase-option auction ${purchaseType === 'auction' ? 'selected' : ''}`}
          onClick={() => purchaseOptions.length > 1 && setPurchaseType('auction')}
        >
          <div className="option-header">
            <div className="option-title">
              <FaGavel className="option-icon" />
              <span>Subasta en Vivo</span>
            </div>
            <div className="option-price">
              {event.auctionCurrency === 'ETH' && <FaEthereum className="currency-icon" />}
              {event.auctionCurrency === 'MATIC' && <SiPolygon className="currency-icon" />}
              <span>{event.currentBid} {event.auctionCurrency}</span>
            </div>
          </div>
          <div className="option-details">
            <span className="auction-time">Termina en {event.auctionTimeLeft}</span>
            <span className="bid-info">Puja mínima: +0.01 {event.auctionCurrency}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderDetailsStep = () => (
    <motion.div 
      className="modal-content-section will-change-transform"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Event Header */}
      <div className="event-header">
        <div className="event-image-modal">
          <img src={event.image} alt={event.title} />
          <div className="event-overlay"></div>
        </div>
        <div className="event-info-header">
          <h2 className="event-title-modal">{event.title}</h2>
          <p className="event-description-modal">{event.description}</p>
        </div>
      </div>

      {/* Event Details */}
      <div className="event-details-section">
        <div className="detail-row">
          <FaCalendarAlt className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Fecha</span>
            <span className="detail-value">{event.date}</span>
          </div>
        </div>
        
        <div className="detail-row">
          <FaMapMarkerAlt className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Ubicación</span>
            <span className="detail-value">{event.location}</span>
          </div>
        </div>

        <div className="detail-row">
          <FaClock className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Hora</span>
            <span className="detail-value">20:00 hrs</span>
          </div>
        </div>

        <div className="detail-row">
          <FaUsers className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Disponibilidad</span>
            <span className="detail-value">{event.availableTickets || 150} tickets disponibles</span>
          </div>
        </div>
      </div>

      {/* Ticket Selection */}
      <div className="ticket-selection">
        <h3 className="section-title">Seleccionar Tipo de Compra</h3>
        {renderPurchaseOptions()}
        
        {/* Quantity Selector */}
        <div className="quantity-selector">
          <span className="quantity-label">Cantidad:</span>
          <div className="quantity-controls">
            <button 
              className="quantity-btn cursor-pointer transition active:scale-95 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
              disabled={selectedQuantity <= 1}
            >
              <FaMinus />
            </button>
            <span className="quantity-display">{selectedQuantity}</span>
            <button 
              className="quantity-btn cursor-pointer transition active:scale-95 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setSelectedQuantity(Math.min(10, selectedQuantity + 1))}
              disabled={selectedQuantity >= 10}
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="payment-method-selection">
          <span className="payment-label">Método de Pago:</span>
          <div className="payment-method-tabs">
            {paymentOptions.map(opt => (
              <button
                key={opt.key}
                className={`payment-tab ${paymentMethod === opt.key ? 'active' : ''} cursor-pointer transition active:scale-[0.98] focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500`}
                onClick={() => setPaymentMethod(opt.key)}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Blockchain Selection - Solo si método crypto */}
        {paymentMethod === 'crypto' && (
          <div className="blockchain-selection">
            <span className="blockchain-label">Blockchain:</span>
            <div className="blockchain-grid">
              {blockchainOptions.map((chain) => (
                <button
                  key={chain.id}
                  className={`blockchain-option ${selectedBlockchain === chain.id ? 'selected' : ''} cursor-pointer transition focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500`}
                  onClick={() => setSelectedBlockchain(chain.id)}
                  style={{ borderColor: selectedBlockchain === chain.id ? chain.color : 'transparent' }}
                >
                  <div className="chain-icon-wrapper" style={{ color: chain.color }}>
                    {chain.icon}
                  </div>
                  <div className="chain-info">
                    <span className="chain-name">{chain.name}</span>
                    <span className="chain-price">{chain.price}</span>
                    <span className="chain-gas">{chain.gasEstimate}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Card Payment Info - Solo si método card */}
        {paymentMethod === 'card' && (
          <div className="card-payment-info">
            <h4 className="card-title"><FaCreditCard style={{marginRight:8}}/> Tarjetas de débito y crédito <span className="stripe-badge"><SiStripe style={{marginRight:4}}/> Stripe</span></h4>
            <div className="accepted-cards">
              <span>Tarjetas aceptadas:</span>
              <div className="card-icons">
                <SiVisa className="card-icon visa" />
                <SiMastercard className="card-icon mastercard" />
                <FaCreditCard className="card-icon generic" />
              </div>
            </div>
            <div className="card-instructions">
              <FaLock style={{marginRight:6}}/> Pago seguro y cifrado. Aceptamos tarjetas nacionales e internacionales.
            </div>
            {/* Selector de Moneda */}
            <div className="currency-selector">
              <span className="currency-label">Moneda:</span>
              <div className="currency-options">
                <button
                  className={`currency-btn ${selectedCurrency === 'USD' ? 'active' : ''}`}
                  onClick={() => setSelectedCurrency('USD')}
                >
                  <span className="currency-code">USD</span>
                  <span className="currency-price">${priceUSD}</span>
                </button>
                <button
                  className={`currency-btn ${selectedCurrency === 'MXN' ? 'active' : ''}`}
                  onClick={() => setSelectedCurrency('MXN')}
                >
                  <span className="currency-code">MXN</span>
                  <span className="currency-price">${priceMXN.toFixed(2)}</span>
                </button>
              </div>
              <div className="exchange-rate-info">
                <FaExchangeAlt className="exchange-icon" />
                <span>1 USD = {exchangeRate} MXN</span>
              </div>
            </div>
            <div className="card-price">
              <span className="price-label">Precio:</span>
              <span className="price-value">{getCurrencySymbol()}{getCurrentPrice()} {getCurrencyCode()}</span>
            </div>
            <div className="card-benefits">
              <div className="benefit-item">
                <FaShieldAlt className="benefit-icon" />
                <span>Pago 100% seguro</span>
              </div>
              <div className="benefit-item">
                <FaCheckCircle className="benefit-icon" />
                <span>Confirmación instantánea</span>
              </div>
              <div className="benefit-item">
                <FaLock className="benefit-icon" />
                <span>Datos encriptados</span>
              </div>
            </div>
            {/* Botón de pago destacado (simulado) */}
            <button className="btn-primary card-pay-btn focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
              <FaCreditCard style={{marginRight:8}}/> Pagar con tarjeta
            </button>
          </div>
        )}

        {/* SPEI Instructions */}
        {paymentMethod === 'spei' && (
          <div className="spei-box">
            <h4><FaUniversity style={{marginRight: 8}}/> Transferencia SPEI</h4>
            <ul className="spei-list">
              <li><FaMoneyCheckAlt className="spei-icon"/> <strong>Banco:</strong> BBVA México</li>
              <li><FaBarcode className="spei-icon"/> <strong>CLABE:</strong> <span className="spei-mono">012345678901234567</span>
                <button className="spei-copy" onClick={() => copyToClipboard('012345678901234567')} title="Copiar CLABE"><FaCopy /></button>
              </li>
              <li><FaBarcode className="spei-icon"/> <strong>Referencia:</strong> <span className="spei-mono">{`TSF-${event.id}-${selectedQuantity}`}</span>
                <button className="spei-copy" onClick={() => copyToClipboard(`TSF-${event.id}-${selectedQuantity}`)} title="Copiar referencia"><FaCopy /></button>
              </li>
              <li><strong>Monto:</strong> <span className="spei-mono">${getTotalPrice().toFixed(2)} MXN</span></li>
            </ul>
            <p className="spei-instructions">Realiza una transferencia desde tu banca móvil o portal bancario.<br/>Una vez realizado el pago, haz clic en el botón de abajo.</p>
            <button className="btn-primary spei-pay-btn focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500" onClick={() => setCurrentStep('checkout')}>
              <FaUniversity style={{marginRight: 8}}/> Ya realicé mi pago
            </button>
            <div className="spei-wait-message">
              <FaUniversity /> <span>Esperando confirmación bancaria...</span><br/>
              <span className="spei-wait-detail">Recibirás tu ticket NFT por email y en tu perfil una vez validado el pago.</span>
            </div>
          </div>
        )}

        {/* Dimo Instructions */}
        {paymentMethod === 'dimo' && (
          <div className="dimo-box">
            <h4><FaQrcode style={{marginRight: 8}}/> Paga con Dimo</h4>
            <a href="#" className="btn-primary dimo-pay-btn focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500" style={{marginBottom: '1rem'}}>
              <FaQrcode style={{marginRight: 8}} /> Ir a Dimo
            </a>
            <p className="dimo-instructions">
              Al completar el pago en Dimo, recibirás tu ticket NFT automáticamente por email y en tu perfil.
            </p>
            <div className="dimo-wait-message">
              <FaCheckCircle style={{color:'#67e8a0',marginRight:6}}/> <span>Esperando confirmación de Dimo...</span><br/>
              <span className="dimo-wait-detail">Recibirás tu ticket NFT por email y en tu perfil una vez validado el pago.</span>
            </div>
          </div>
        )}

        {/* OXXO Instructions */}
        {paymentMethod === 'oxxo' && (
          <div className="oxxo-box">
            <h4><FaStore style={{marginRight: 8}}/> Pago en Efectivo (OXXO/7-Eleven)</h4>
            <ul className="oxxo-list">
              <li><FaBarcode className="oxxo-icon"/> <strong>Referencia:</strong> <span className="oxxo-mono">{`OXXO-${event.id}-${selectedQuantity}`}</span>
                <button className="oxxo-copy" onClick={() => copyToClipboard(`OXXO-${event.id}-${selectedQuantity}`)} title="Copiar referencia"><FaCopy /></button>
              </li>
              <li><strong>Monto:</strong> <span className="oxxo-mono">${getTotalPrice().toFixed(2)} MXN</span></li>
            </ul>
            <p className="oxxo-instructions">
              Acude a cualquier tienda OXXO o 7-Eleven y proporciona la referencia y el monto al cajero.<br/>
              Conserva tu comprobante. Una vez realizado el pago, haz clic en el botón de abajo.
            </p>
            <button className="btn-primary oxxo-pay-btn focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500" onClick={() => setCurrentStep('checkout')}>
              <FaStore style={{marginRight: 8}}/> Ya pagué en OXXO/7-Eleven
            </button>
            <div className="oxxo-wait-message">
              <FaStore /> <span>Esperando confirmación de OXXO/7-Eleven...</span><br/>
              <span className="oxxo-wait-detail">Recibirás tu ticket NFT por email y en tu perfil una vez validado el pago.</span>
            </div>
          </div>
        )}

        {/* Mercado Pago Instructions */}
        {paymentMethod === 'mercadopago' && (
          <div className="mp-box">
            <h4><SiMercadopago style={{marginRight: 8, color:'#009ee3'}}/> Mercado Pago</h4>
            <a href="#" className="btn-primary mp-pay-btn focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500" style={{marginBottom: '1rem', background: 'linear-gradient(90deg, #009ee3 0%, #00d4c4 100%)', color:'#fff'}}>
              <SiMercadopago style={{marginRight: 8}} /> Ir a Mercado Pago
            </a>
            <p className="mp-instructions">
              Serás redirigido a Mercado Pago para completar tu pago con tarjeta, efectivo o saldo en cuenta.<br/>
              Al finalizar, recibirás tu ticket NFT automáticamente por email y en tu perfil.
            </p>
            <div className="mp-wait-message">
              <FaCheckCircle style={{color:'#67e8a0',marginRight:6}}/> <span>Esperando confirmación de Mercado Pago...</span><br/>
              <span className="mp-wait-detail">Recibirás tu ticket NFT por email y en tu perfil una vez validado el pago.</span>
            </div>
          </div>
        )}

        {/* Kueski Instructions */}
        {paymentMethod === 'kueski' && (
          <div className="kueski-box">
            <h4 style={{display:'flex',alignItems:'center',gap:8}}>
              <SiKlarna style={{height:'1.5em',marginRight:8,color:'#00e084'}}/>
              Kueski Pay
            </h4>
            <a href="#" className="btn-primary kueski-pay-btn focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500" style={{marginBottom: '1rem', background: 'linear-gradient(90deg, #00e084 0%, #00b383 100%)', color:'#fff'}}>
              <SiKlarna style={{height:'1.3em',marginRight:8,color:'#00e084'}}/> Pagar con Kueski Pay
            </a>
            <p className="kueski-instructions">
              Compra ahora y paga después con Kueski Pay. Serás redirigido para completar tu solicitud y pago.<br/>
              Al finalizar, recibirás tu ticket NFT automáticamente por email y en tu perfil.
            </p>
            <div className="kueski-wait-message">
              <FaCheckCircle style={{color:'#67e8a0',marginRight:6}}/> <span>Esperando confirmación de Kueski Pay...</span><br/>
              <span className="kueski-wait-detail">Recibirás tu ticket NFT por email y en tu perfil una vez validado el pago.</span>
            </div>
          </div>
        )}

        {/* Price Summary */}
        <div className="price-summary">
          <div className="price-row">
            <span>Precio por ticket:</span>
            <span>{paymentMethod === 'crypto' ? selectedChain?.price : `${getCurrencySymbol()}${getCurrentPrice()}`}</span>
          </div>
          <div className="price-row">
            <span>Cantidad:</span>
            <span>{selectedQuantity}</span>
          </div>
          {paymentMethod === 'crypto' && (
            <>
              <div className="price-row">
                <span>Gas estimado:</span>
                <span>{selectedChain?.gasEstimate}</span>
              </div>
              <div className="price-row">
                <span>Comisión plataforma (0.3%):</span>
                <span>{getProcessingFee()} {selectedChain?.price.split(' ')[1] || 'ETH'}</span>
              </div>
            </>
          )}
          {paymentMethod === 'card' && (
            <div className="price-row">
              <span>Comisión procesamiento (1%):</span>
              <span>{getCurrencySymbol()}{getProcessingFee()}</span>
            </div>
          )}
          <div className="price-row total">
            <span>Total:</span>
            <span>{paymentMethod === 'crypto' ? totalPrice : `${getCurrencySymbol()}${(getTotalPrice() + getProcessingFee()).toFixed(2)}`}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="modal-actions">
        <button className="btn-secondary focus-ring" onClick={onClose}>
          Cancelar
        </button>
        <button 
          className="btn-primary focus-ring"
          onClick={() => setCurrentStep('checkout')}
        >
          <FaShoppingCart />
          Continuar al Checkout
        </button>
      </div>
    </motion.div>
  );

  // Componente de loading mejorado
  const renderLoadingOverlay = () => (
    <motion.div 
      className="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loading-content">
        <div className="loading-icon">
          <FaSpinner className="spinning" />
        </div>
        <h3 className="loading-title">{loadingMessage}</h3>
        <div className="loading-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <span className="progress-text">{loadingProgress}%</span>
        </div>
        <div className="loading-steps">
          <div className={`step ${loadingStep === 'validating' ? 'active' : loadingStep === 'processing' || loadingStep === 'minting' || loadingStep === 'confirming' ? 'completed' : ''}`}>
            <FaCheckCircle className="step-icon" />
            <span>Validación</span>
          </div>
          <div className={`step ${loadingStep === 'processing' ? 'active' : loadingStep === 'minting' || loadingStep === 'confirming' ? 'completed' : ''}`}>
            <FaSpinner className={`step-icon ${loadingStep === 'processing' ? 'spinning' : ''}`} />
            <span>Procesamiento</span>
          </div>
          <div className={`step ${loadingStep === 'minting' ? 'active' : loadingStep === 'confirming' ? 'completed' : ''}`}>
            <FaSpinner className={`step-icon ${loadingStep === 'minting' ? 'spinning' : ''}`} />
            <span>Minting NFT</span>
          </div>
          <div className={`step ${loadingStep === 'confirming' ? 'active' : ''}`}>
            <FaSpinner className={`step-icon ${loadingStep === 'confirming' ? 'spinning' : ''}`} />
            <span>Confirmación</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Componente de error
  const renderErrorOverlay = () => (
    <motion.div 
      className="error-overlay"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div className="error-content">
        <div className="error-icon">
          <FaExclamationTriangle />
        </div>
        <h3 className="error-title">Error en la Transacción</h3>
        <p className="error-message">{errorMessage}</p>
        <button 
          className="btn-primary error-retry focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
          onClick={() => {
            setShowError(false);
            setErrorMessage('');
            handlePurchase();
          }}
        >
          Intentar Nuevamente
        </button>
      </div>
    </motion.div>
  );

  const renderCheckoutStep = () => (
    <motion.div 
      className="modal-content-section"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="checkout-header">
        <h2 className="checkout-title">Checkout</h2>
        <div className="security-badge">
          <FaShieldAlt />
          <span>Transacción Segura</span>
        </div>
      </div>

      {/* Order Summary */}
      <div className="order-summary">
        <h3 className="section-title">Resumen del Pedido</h3>
        <div className="summary-item">
          <div className="item-info">
            <img src={event.image} alt={event.title} className="summary-image" />
            <div>
              <h4>{event.title}</h4>
              <p>{event.date} • {event.location}</p>
              <span className="purchase-type">
                {purchaseType === 'official' && 'Venta Oficial'}
                {purchaseType === 'resale' && 'Mercado de Reventa'}
                {purchaseType === 'auction' && 'Subasta en Vivo'}
              </span>
            </div>
          </div>
          <div className="item-price">
            <span className="quantity">{selectedQuantity}x</span>
            <span className="price">
              {paymentMethod === 'crypto' ? (
                <>
                  {selectedChain?.price}
                  {purchaseType === 'auction' && (
                    <span className="auction-note">Puja actual</span>
                  )}
                </>
              ) : (
                `${getCurrencySymbol()}${getCurrentPrice()}`
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="payment-method">
        <h3 className="section-title">Método de Pago</h3>
        
        {paymentMethod === 'crypto' && (
          <div className="selected-method">
            <div className="method-icon" style={{ color: selectedChain?.color }}>
              {selectedChain?.icon}
            </div>
            <div className="method-info">
              <span className="method-name">{selectedChain?.name}</span>
              <span className="method-description">
                {purchaseType === 'auction' ? 'Wallet conectada para pujar' : 'Wallet conectada'}
              </span>
            </div>
            <span className="method-total">{totalPrice}</span>
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="card-payment-form">
            <div className="form-section">
              <h4 className="form-title">
                <FaCreditCard />
                Información de la Tarjeta
              </h4>
              
              <div className="card-input-group">
                <div className="input-field">
                  <label>Número de Tarjeta</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.cardNumber}
                      onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                      className="card-input input-base"
                    />
                    <div className="card-type-icons">
                      <SiVisa className="card-type-icon" />
                      <SiMastercard className="card-type-icon" />
                    </div>
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-field">
                    <label>Fecha de Vencimiento</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardData.expiryDate}
                      onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                      className="card-input input-base"
                    />
                  </div>
                  <div className="input-field">
                    <label>CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardData.cvv}
                      onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                      className="card-input input-base"
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label>Nombre del Titular</label>
                  <input
                    type="text"
                    placeholder="Juan Pérez"
                    value={cardData.cardHolder}
                    onChange={(e) => handleCardInputChange('cardHolder', e.target.value)}
                    className="card-input input-base"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4 className="form-title">
                <FaInfoCircle />
                Información de Contacto
              </h4>
              
              <div className="contact-input-group">
                <div className="input-field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={cardData.email}
                    onChange={(e) => handleCardInputChange('email', e.target.value)}
                    className="card-input input-base"
                  />
                </div>
                <div className="input-field">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    placeholder="1234567890"
                    value={cardData.phone}
                    onChange={(e) => handleCardInputChange('phone', e.target.value)}
                    className="card-input input-base"
                  />
                </div>
              </div>
            </div>

            <div className="payment-total">
              <span>Total a pagar:</span>
              <span className="total-amount">{getCurrencySymbol()}{(getTotalPrice() + getProcessingFee()).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="terms-section">
            <div className="terms-item">
          <FaInfoCircle className="terms-icon" />
          <span>Los tickets son NFTs únicos y verificables en blockchain</span>
        </div>
        <div className="terms-item">
          <FaShieldAlt className="terms-icon" />
          <span>Transacción 100% segura y descentralizada</span>
        </div>
        <div className="terms-item">
          <FaCheckCircle className="terms-icon" />
          <span>Tickets transferibles y revendibles</span>
        </div>
            <div className="terms-item">
              <FaInfoCircle className="terms-icon" />
              <span className="text-amber-200">Demo experimental: no procesamos pagos reales ni custodiamos fondos. Solo fines educativos.</span>
            </div>
      </div>

      {/* Action Buttons */}
      <div className="modal-actions">
        <button 
          className="btn-secondary focus-ring" 
          onClick={() => setCurrentStep('details')}
        >
          Volver
        </button>
        <button 
          className="btn-primary purchase-btn focus-ring"
          onClick={handlePurchase}
          disabled={isProcessing || (paymentMethod === 'card' && !isCardDataValid())}
        >
          {isProcessing ? (
            <>
              <FaSpinner className="spinning" />
              Procesando Transacción...
            </>
          ) : (
            <>
              {paymentMethod === 'crypto' ? <FaWallet /> : <FaCreditCard />}
              {paymentMethod === 'crypto' ? 'Confirmar Compra' : 'Procesar Pago'}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderConfirmationStep = () => (
    <motion.div 
      className="modal-content-section confirmation"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="confirmation-icon">
        <FaCheckDouble />
      </div>
      <h2 className="confirmation-title">¡Compra Exitosa!</h2>
      <p className="confirmation-message">
        Tus tickets NFT han sido creados y enviados a tu wallet. 
        <br />
        <span className="success-note">¡Disfruta del evento!</span>
      </p>
      
      <div className="transaction-details">
        <div className="transaction-row">
          <span>Evento:</span>
          <span>{event.title}</span>
        </div>
        <div className="transaction-row">
          <span>Cantidad:</span>
          <span>{selectedQuantity} tickets</span>
        </div>
        <div className="transaction-row">
          <span>Método de pago:</span>
          <span>{paymentMethod === 'crypto' ? selectedChain?.name : 'Tarjeta de Crédito/Débito'}</span>
        </div>
        <div className="transaction-row">
          <span>Total pagado:</span>
          <span>{paymentMethod === 'crypto' ? totalPrice : `${getCurrencySymbol()}${(getTotalPrice() + getProcessingFee()).toFixed(2)}`}</span>
        </div>
        {paymentMethod === 'crypto' && (
          <div className="transaction-row">
            <span>Hash de transacción:</span>
            <span className="hash">0x1234...5678</span>
          </div>
        )}
        {paymentMethod === 'card' && (
          <div className="transaction-row">
            <span>ID de transacción:</span>
            <span className="hash">TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
        )}
      </div>

      <div className="modal-actions">
        <button className="btn-secondary focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500" onClick={handleViewTicket}>
          Ver mi Ticket NFT
        </button>
        <button className="btn-primary focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </motion.div>
  );

  const renderTicketStep = () => (
    <motion.div 
      className="modal-content-section ticket"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="ticket-header">
        <h2 className="ticket-title">Tu Ticket NFT</h2>
        <div className="ticket-qr-code">
          <img src={generatedTicket.qrCode} alt={`Ticket NFT para ${generatedTicket.eventTitle}`} />
        </div>
      </div>

      <div className="ticket-details">
        <h3 className="section-title">Detalles del Ticket</h3>
        <div className="detail-row">
          <FaInfoCircle className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">ID del Ticket:</span>
            <span className="detail-value">{generatedTicket.id}</span>
          </div>
        </div>
        <div className="detail-row">
          <FaQrcode className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Código QR:</span>
            <span className="detail-value">{generatedTicket.qrCode}</span>
          </div>
        </div>
        <div className="detail-row">
          <FaUsers className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Evento:</span>
            <span className="detail-value">{generatedTicket.eventTitle}</span>
          </div>
        </div>
        <div className="detail-row">
          <FaCalendarAlt className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Fecha:</span>
            <span className="detail-value">{generatedTicket.eventDate}</span>
          </div>
        </div>
        <div className="detail-row">
          <FaMapMarkerAlt className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Ubicación:</span>
            <span className="detail-value">{generatedTicket.eventLocation}</span>
          </div>
        </div>
        <div className="detail-row">
          <FaUsers className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Tipo de Ticket:</span>
            <span className="detail-value">{generatedTicket.ticketType}</span>
          </div>
        </div>
        <div className="detail-row">
          <FaUsers className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Asiento:</span>
            <span className="detail-value">{generatedTicket.seatNumber}</span>
          </div>
        </div>
        <div className="detail-row">
          <FaEthereum className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Precio:</span>
            <span className="detail-value">{generatedTicket.price}</span>
          </div>
        </div>
        <div className="detail-row">
          <FaCalendar className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Fecha de Compra:</span>
            <span className="detail-value">{generatedTicket.purchaseDate}</span>
          </div>
        </div>
        <div className="detail-row">
          <FaUsers className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Propietario:</span>
            <span className="detail-value">{generatedTicket.owner}</span>
          </div>
        </div>
        <div className="detail-row">
          <FaQrcode className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Hash de Transacción:</span>
            <span className="detail-value">{generatedTicket.transactionHash}</span>
          </div>
        </div>
      </div>

      <div className="ticket-actions">
        <button className="btn-secondary focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500" onClick={handleViewTicket}>
          <FaShoppingCart /> Comprar Otro Ticket
        </button>
        <button className="btn-primary focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500" onClick={handleDownloadTicket}>
          <FaDownload /> Descargar Ticket
        </button>
        <button className="btn-primary focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500" onClick={handleShareTicket}>
          <FaShareAlt /> Compartir Ticket
        </button>
      </div>
    </motion.div>
  );

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="ticket-modal-backdrop backdrop-blur-sm md:backdrop-blur-md"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.div 
            className="ticket-modal rounded-2xl border border-white/10 bg-slate-800/95 shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.95)',
              borderRadius: '24px',
              maxWidth: '900px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 1000000
            }}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title">
                {currentStep === 'details' && 'Detalles del Evento'}
                {currentStep === 'checkout' && 'Checkout'}
                {currentStep === 'confirmation' && 'Confirmación'}
                {currentStep === 'ticket' && 'Tu Ticket NFT'}
              </div>
              <button className="modal-close focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500" onClick={onClose}>
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div className="modal-content">
              <AnimatePresence mode="wait">
                {currentStep === 'details' && renderDetailsStep()}
                {currentStep === 'checkout' && renderCheckoutStep()}
                {currentStep === 'confirmation' && renderConfirmationStep()}
                {currentStep === 'ticket' && renderTicketStep()}
              </AnimatePresence>
              
              {/* Loading Overlay */}
              <AnimatePresence>
                {isProcessing && renderLoadingOverlay()}
              </AnimatePresence>
              
              {/* Error Overlay */}
              <AnimatePresence>
                {showError && renderErrorOverlay()}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default TicketModal;