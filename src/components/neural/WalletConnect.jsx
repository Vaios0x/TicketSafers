import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWallet, FaUser, FaSignOutAlt, FaCopy, FaExternalLinkAlt, FaNetworkWired, FaChevronDown, FaExchangeAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { useAccount, useDisconnect, useBalance, useSwitchChain } from 'wagmi';
import { getNetworkInfo, TESTNET_CONFIG } from '../../config/testnet-config';
import { useReownModal } from '../../hooks/useReownModal';
import { applyAllModalStyles } from '../../utils/modalPositionFix';

const WalletConnect = () => {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({
    address,
  });
  const { open } = useReownModal();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [showChainSelector, setShowChainSelector] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);

  // Aplicar estilos del modal cuando el componente se monta
  useEffect(() => {
    const cleanup = applyAllModalStyles();
    return cleanup;
  }, []);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showChainSelector && !event.target.closest('.chain-selector')) {
        setShowChainSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showChainSelector]);

  // Función para manejar la conexión con reintentos
  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      // Limpiar cualquier estado previo
      await disconnect();
      
      // Pequeño delay para asegurar que MetaMask esté listo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Abrir modal de conexión
      open();
      
      // Aplicar estilos después de abrir el modal
      setTimeout(() => {
        applyAllModalStyles();
      }, 200);
    } catch (error) {
      console.error('Error al conectar wallet:', error);
      setConnectionError('Error al conectar. Intenta de nuevo.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Función para cambiar de red
  const handleChainSwitch = async (chainId) => {
    try {
      setIsSwitchingChain(true);
      await switchChain({ chainId });
      setShowChainSelector(false);
    } catch (error) {
      console.error('Error al cambiar de red:', error);
    } finally {
      setIsSwitchingChain(false);
    }
  };

  // Función para copiar dirección con feedback visual
  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
        console.log('✅ Dirección copiada al portapapeles');
      } catch (err) {
        console.error('❌ Error al copiar dirección:', err);
      }
    }
  };

  // Función para abrir en explorador (detecta la red)
  const openInExplorer = () => {
    if (address) {
      const chainId = chain?.id;
      const networkInfo = getNetworkInfo(chainId);
      window.open(`${networkInfo.explorer}/address/${address}`, '_blank');
    }
  };

  // Formatear dirección
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Obtener información de la red usando la configuración centralizada
  const getNetworkName = () => {
    const chainId = chain?.id;
    const networkInfo = getNetworkInfo(chainId);
    return networkInfo.shortName || networkInfo.name;
  };

  // Obtener color de la red usando la configuración centralizada
  const getNetworkColor = () => {
    const chainId = chain?.id;
    const networkInfo = getNetworkInfo(chainId);
    return networkInfo.color;
  };

  // Formatear balance
  const formatBalance = (balance) => {
    if (!balance) return '0.00';
    return parseFloat(balance.formatted).toFixed(4);
  };

  if (isConnected && address) {
    return (
      <motion.div 
        className="wallet-connected"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '16px 20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(59, 130, 246, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          position: 'relative',
          minWidth: '320px'
        }}
      >
        {/* Avatar con gradiente mejorado */}
        <div style={{
          width: '48px',
          height: '48px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '20px',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <FaUser />
          {/* Efecto de brillo */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
            animation: 'shine 3s infinite'
          }}></div>
        </div>
        
        {/* Información principal */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '4px',
            letterSpacing: '0.5px'
          }}>
            {formatAddress(address)}
          </div>
          
          {/* Información de red y balance */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#94a3b8'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                background: getNetworkColor(),
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
                boxShadow: `0 0 8px ${getNetworkColor()}40`
              }}></span>
              <span style={{ fontWeight: '600', color: '#ffffff' }}>
                {getNetworkName()}
              </span>
            </div>
            
            {balance && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <span style={{ color: '#10b981', fontWeight: '600' }}>
                  {formatBalance(balance)} {balance.symbol}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Acciones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Selector de Chain mejorado */}
          <div style={{ position: 'relative' }} className="chain-selector">
            <motion.button 
              onClick={() => setShowChainSelector(!showChainSelector)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(29, 78, 216, 0.1) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              title="Cambiar red"
              className="chain-selector-btn"
              disabled={isSwitchingChain}
            >
              {isSwitchingChain ? (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              ) : (
                <FaExchangeAlt />
              )}
            </motion.button>
            
            {/* Dropdown de Chains mejorado */}
            <AnimatePresence>
              {showChainSelector && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '12px',
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(59, 130, 246, 0.1)',
                    zIndex: 1000,
                    minWidth: '220px',
                    overflow: 'hidden'
                  }}
                  className="chain-selector-dropdown"
                >
                  <div style={{
                    padding: '12px 0',
                    maxHeight: '320px',
                    overflowY: 'auto'
                  }}
                  className="chain-list"
                  >
                    {TESTNET_CONFIG.supportedNetworks.map((network) => (
                      <motion.button
                        key={network.id}
                        onClick={() => handleChainSwitch(network.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          background: chain?.id === network.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                          border: 'none',
                          color: chain?.id === network.id ? '#3b82f6' : '#ffffff',
                          fontSize: '14px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all 0.2s ease',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          position: 'relative'
                        }}
                        className={`chain-option ${chain?.id === network.id ? 'active' : ''}`}
                        disabled={isSwitchingChain}
                      >
                        <span style={{
                          width: '10px',
                          height: '10px',
                          background: network.color,
                          borderRadius: '50%',
                          flexShrink: 0,
                          boxShadow: `0 0 8px ${network.color}40`
                        }}
                        className="chain-indicator"
                        ></span>
                        <span style={{ flex: 1, fontWeight: '500' }}>
                          {network.shortName}
                        </span>
                        {chain?.id === network.id && (
                          <span style={{
                            fontSize: '10px',
                            color: '#3b82f6',
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            background: 'rgba(59, 130, 246, 0.2)',
                            borderRadius: '4px'
                          }}
                          className="chain-current-label"
                          >
                            ACTUAL
                          </span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Botón copiar con feedback visual */}
          <motion.button 
            onClick={copyAddress}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '36px',
              height: '36px',
              background: copiedAddress 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              border: copiedAddress 
                ? '1px solid #10b981'
                : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: copiedAddress ? '#ffffff' : '#ffffff',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            title={copiedAddress ? "¡Copiado!" : "Copiar dirección"}
          >
            {copiedAddress ? <FaCheck /> : <FaCopy />}
          </motion.button>
          
          {/* Botón explorador */}
          <motion.button 
            onClick={openInExplorer}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            title="Ver en explorador"
          >
            <FaExternalLinkAlt />
          </motion.button>
          
          {/* Botón desconectar */}
          <motion.button 
            onClick={() => disconnect()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            title="Desconectar"
          >
            <FaSignOutAlt />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={handleConnect}
      disabled={isConnecting}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)',
        border: 'none',
        borderRadius: '16px',
        padding: '14px 28px',
        color: 'white',
        fontWeight: '700',
        fontSize: '15px',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        transition: 'all 0.3s ease',
        boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        opacity: isConnecting ? 0.7 : 1,
        cursor: isConnecting ? 'not-allowed' : 'pointer',
        position: 'relative',
        overflow: 'hidden',
        minWidth: '200px'
      }}
    >
      {/* Efecto de brillo de fondo */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
        animation: 'shine 3s infinite',
        pointerEvents: 'none'
      }}></div>
      
      {/* Contenido del botón */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px'
        }}>
          {isConnecting ? (
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid transparent',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          ) : (
            <FaWallet />
          )}
        </div>
        
        <span style={{ fontWeight: '700' }}>
          {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
        </span>
        
        {connectionError && (
          <span style={{ 
            marginLeft: '8px', 
            fontSize: '12px', 
            color: '#ef4444',
            fontWeight: '500'
          }}>
            {connectionError}
          </span>
        )}
      </div>
    </motion.button>
  );
};

export default WalletConnect; 