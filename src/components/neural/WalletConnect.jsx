import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWallet, FaUser, FaSignOutAlt, FaCopy, FaExternalLinkAlt, FaNetworkWired, FaChevronDown, FaExchangeAlt } from 'react-icons/fa';
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
      await switchChain({ chainId });
      setShowChainSelector(false);
    } catch (error) {
      console.error('Error al cambiar de red:', error);
    }
  };

  // Función para copiar dirección
  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        console.log('✅ Dirección copiada al portapapeles');
        // Aquí podrías agregar un toast notification
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
    return networkInfo.name;
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          padding: '12px 16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'relative'
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px'
        }}>
          <FaUser />
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '2px'
          }}>
            {formatAddress(address)}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#94a3b8'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              background: getNetworkColor(),
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></span>
            {getNetworkName()}
            {balance && (
              <span style={{ marginLeft: '8px' }}>
                {formatBalance(balance)} {balance.symbol}
              </span>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Selector de Chain */}
          <div style={{ position: 'relative' }} className="chain-selector">
            <button 
              onClick={() => setShowChainSelector(!showChainSelector)}
              style={{
                width: '32px',
                height: '32px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.color = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.color = '#ffffff';
              }}
              title="Cambiar red"
              className="chain-selector-btn"
            >
              <FaExchangeAlt />
            </button>
            
            {/* Dropdown de Chains */}
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
                    marginTop: '8px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    zIndex: 1000,
                    minWidth: '200px',
                    overflow: 'hidden'
                  }}
                  className="chain-selector-dropdown"
                >
                  <div style={{
                    padding: '8px 0',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}
                  className="chain-list"
                  >
                    {TESTNET_CONFIG.supportedNetworks.map((network) => (
                      <button
                        key={network.id}
                        onClick={() => handleChainSwitch(network.id)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'transparent',
                          border: 'none',
                          color: chain?.id === network.id ? '#3b82f6' : '#ffffff',
                          fontSize: '13px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all 0.2s ease',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                        className={`chain-option ${chain?.id === network.id ? 'active' : ''}`}
                      >
                        <span style={{
                          width: '8px',
                          height: '8px',
                          background: network.color,
                          borderRadius: '50%',
                          flexShrink: 0
                        }}
                        className="chain-indicator"
                        ></span>
                        <span style={{ flex: 1 }}>
                          {network.shortName}
                        </span>
                        {chain?.id === network.id && (
                          <span style={{
                            fontSize: '10px',
                            color: '#3b82f6',
                            fontWeight: 'bold'
                          }}
                          className="chain-current-label"
                          >
                            ACTUAL
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={copyAddress}
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.color = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#ffffff';
            }}
            title="Copiar dirección"
          >
            <FaCopy />
          </button>
          
          <button 
            onClick={openInExplorer}
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.color = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#ffffff';
            }}
            title="Ver en explorador"
          >
            <FaExternalLinkAlt />
          </button>
          
          <button 
            onClick={() => disconnect()}
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = '#ffffff';
            }}
            title="Desconectar"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={handleConnect}
      disabled={isConnecting}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        border: 'none',
        borderRadius: '12px',
        padding: '12px 24px',
        color: 'white',
        fontWeight: '700',
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        backdropFilter: 'blur(10px)',
        opacity: isConnecting ? 0.7 : 1,
        cursor: isConnecting ? 'not-allowed' : 'pointer'
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
      }}
      whileTap={{ scale: 0.98 }}
    >
      <FaWallet style={{ fontSize: '16px' }} />
      <span>Conectar Wallet</span>
      {isConnecting && (
        <span style={{ marginLeft: '8px', fontSize: '12px', color: 'white' }}>
          Conectando...
        </span>
      )}
      {connectionError && (
        <span style={{ marginLeft: '8px', fontSize: '12px', color: 'red' }}>
          {connectionError}
        </span>
      )}
    </motion.button>
  );
};

export default WalletConnect; 