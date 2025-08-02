import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaUser, FaSignOutAlt, FaCopy, FaExternalLinkAlt, FaNetworkWired, FaChevronDown, FaExchangeAlt } from 'react-icons/fa';
import { useAccount, useDisconnect, useBalance, useSwitchChain } from 'wagmi';
import { getNetworkInfo, TESTNET_CONFIG } from '../../config/testnet-config';
import { useReownModal } from '../../hooks/useReownModal';
import { applyAllModalStyles } from '../../utils/modalPositionFix';

const WalletConnect = () => {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
  });
  const { switchChain } = useSwitchChain();
  const { open } = useReownModal();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  // Aplicar estilos del modal cuando el componente se monta
  useEffect(() => {
    const cleanup = applyAllModalStyles();
    return cleanup;
  }, []);

  // Cerrar selector de red cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNetworkSelector && !event.target.closest('.network-selector')) {
        setShowNetworkSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNetworkSelector]);

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

  // Función para cambiar de red
  const handleNetworkSwitch = async (chainId) => {
    if (isSwitchingNetwork) return;
    
    setIsSwitchingNetwork(true);
    try {
      await switchChain({ chainId });
      setShowNetworkSelector(false);
      console.log(`✅ Red cambiada a ${getNetworkInfo(chainId).name}`);
    } catch (error) {
      console.error('❌ Error al cambiar red:', error);
    } finally {
      setIsSwitchingNetwork(false);
    }
  };

  // Función para alternar el selector de red
  const toggleNetworkSelector = () => {
    setShowNetworkSelector(!showNetworkSelector);
  };

  // Obtener la red actual
  const getCurrentNetwork = () => {
    const chainId = chain?.id;
    return getNetworkInfo(chainId);
  };

  // Verificar si la red actual es soportada
  const isCurrentNetworkSupported = () => {
    const chainId = chain?.id;
    return TESTNET_CONFIG.supportedNetworks.some(network => network.id === chainId);
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
          gap: '12px'
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
          {/* Selector de red */}
          <div style={{ position: 'relative' }} className="network-selector">
            <button 
              onClick={toggleNetworkSelector}
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
            >
              <FaExchangeAlt />
            </button>
            
            {/* Dropdown del selector de red */}
            {showNetworkSelector && (
              <>
                {/* Backdrop para móviles */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 9999
                  }}
                  onClick={() => setShowNetworkSelector(false)}
                />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(15, 23, 42, 0.98)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '16px',
                    padding: '16px',
                    width: '90vw',
                    maxWidth: '320px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                    zIndex: 10000
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#ffffff',
                      margin: 0
                    }}>
                      Seleccionar Red
                    </h3>
                    <button
                      onClick={() => setShowNetworkSelector(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        fontSize: '18px',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#ffffff';
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#94a3b8';
                        e.target.style.background = 'transparent';
                      }}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {TESTNET_CONFIG.supportedNetworks.map((network) => {
                      const isCurrentNetwork = network.id === chain?.id;
                      return (
                        <button
                          key={network.id}
                          onClick={() => handleNetworkSwitch(network.id)}
                          disabled={isSwitchingNetwork || isCurrentNetwork}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: isCurrentNetwork ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            border: isCurrentNetwork ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: isCurrentNetwork ? '#3b82f6' : '#ffffff',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: isCurrentNetwork ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s ease',
                            opacity: isSwitchingNetwork ? 0.5 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!isCurrentNetwork && !isSwitchingNetwork) {
                              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isCurrentNetwork) {
                              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            }
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            flex: 1
                          }}>
                            <span style={{
                              width: '12px',
                              height: '12px',
                              background: network.color,
                              borderRadius: '50%',
                              boxShadow: `0 0 8px ${network.color}40`
                            }}></span>
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start'
                            }}>
                              <span style={{
                                fontSize: '14px',
                                fontWeight: '600'
                              }}>
                                {network.shortName}
                              </span>
                              <span style={{
                                fontSize: '11px',
                                color: '#94a3b8',
                                marginTop: '2px'
                              }}>
                                {network.description}
                              </span>
                            </div>
                          </div>
                          {isCurrentNetwork && (
                            <span style={{
                              fontSize: '16px',
                              color: '#3b82f6',
                              fontWeight: 'bold'
                            }}>
                              ✓
                            </span>
                          )}
                          {isSwitchingNetwork && network.id === chain?.id && (
                            <span style={{
                              fontSize: '14px',
                              color: '#3b82f6'
                            }}>
                              ...
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
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