import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaUser, FaSignOutAlt, FaCopy, FaExternalLinkAlt, FaNetworkWired, FaExclamationTriangle, FaSync, FaInfoCircle, FaChevronDown, FaExchangeAlt } from 'react-icons/fa';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';

const WalletConnect = () => {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { open } = useAppKit();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  
  // Ref para el dropdown
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowNetworkSelector(false);
      }
    };

    if (showNetworkSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNetworkSelector]);

  // Función para manejar la conexión con mejor UX
  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // Limpiar cualquier error anterior
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Intentar abrir el modal
      open();
      
      // Resetear estado después de un tiempo
      setTimeout(() => {
        setIsConnecting(false);
      }, 3000);
      
    } catch (err) {
      console.error('❌ Error al conectar wallet:', err);
      setError('Error al conectar. Intenta de nuevo.');
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

  // Función para abrir en explorador
  const openInExplorer = () => {
    if (address && chain) {
      const explorerUrl = chain.blockExplorers?.default?.url || 'https://sepolia.etherscan.io';
      window.open(`${explorerUrl}/address/${address}`, '_blank');
    }
  };

  // Formatear dirección
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Obtener nombre de la red
  const getNetworkName = () => {
    if (!chain) return 'Unknown';
    return chain.name;
  };

  // Obtener color de la red
  const getNetworkColor = () => {
    if (!chain) return '#6b7280';
    
    switch (chain.id) {
      case 11155111: return '#627eea'; // Sepolia blue
      case 80001: return '#8247e5'; // Polygon Amoy purple
      case 421614: return '#28a0f0'; // Arbitrum Sepolia blue
      case 11155420: return '#ff0420'; // Optimism Sepolia red
      case 84532: return '#0052ff'; // Base Sepolia blue
      case 534351: return '#ff6b35'; // Scroll Sepolia orange
      default: return '#6b7280'; // Gray
    }
  };

  // Función para desconectar
  const handleDisconnect = () => {
    try {
      disconnect();
      setError(null);
    } catch (err) {
      console.error('❌ Error al desconectar:', err);
    }
  };

  // Función para cambiar de red
  const handleSwitchNetwork = async (chainId) => {
    try {
      await switchChain({ chainId });
      setShowNetworkSelector(false);
    } catch (err) {
      console.error('❌ Error al cambiar de red:', err);
      setError('Error al cambiar de red. Intenta de nuevo.');
    }
  };

  // Información de redes soportadas - TESTNETS
  const supportedNetworks = [
    { 
      name: 'Arbitrum Sepolia', 
      color: '#28a0f0', 
      description: 'L2 Económico (Por defecto) - TESTNET',
      chainId: 421614,
      isDefault: true
    },
    { 
      name: 'Polygon Amoy', 
      color: '#8247e5', 
      description: 'L2 Escalable - TESTNET',
      chainId: 80001
    },
    { 
      name: 'Optimism Sepolia', 
      color: '#ff0420', 
      description: 'L2 Rápido - TESTNET',
      chainId: 11155420
    },
    { 
      name: 'Base Sepolia', 
      color: '#0052ff', 
      description: 'L2 de Coinbase - TESTNET',
      chainId: 84532
    },
    { 
      name: 'Scroll Sepolia', 
      color: '#ff6b35', 
      description: 'L2 ZK-Rollup - TESTNET',
      chainId: 534351
    },
    { 
      name: 'Sepolia', 
      color: '#627eea', 
      description: 'Red Principal - TESTNET',
      chainId: 11155111
    }
  ];

  // Obtener red actual
  const getCurrentNetwork = () => {
    return supportedNetworks.find(network => network.chainId === chain?.id) || supportedNetworks[0];
  };

  if (isConnected && address) {
    const currentNetwork = getCurrentNetwork();
    
    return (
      <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FaExclamationTriangle />
            {error}
          </motion.div>
        )}
        
        <motion.div 
          className="reown-wallet-connected"
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
              <button
                onClick={() => setShowNetworkInfo(!showNetworkInfo)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '10px',
                  marginLeft: '4px'
                }}
                title="Ver redes disponibles"
              >
                <FaInfoCircle />
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Selector de Red */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                ref={buttonRef}
                onClick={() => setShowNetworkSelector(!showNetworkSelector)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '11px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                title="Cambiar red"
              >
                <FaExchangeAlt style={{ fontSize: '10px' }} />
                <span>Red</span>
                <FaChevronDown style={{ fontSize: '8px' }} />
              </button>
              
              {/* Dropdown de Redes */}
              {showNetworkSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '4px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '8px',
                    minWidth: '200px',
                    zIndex: 1000,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#94a3b8',
                    marginBottom: '8px',
                    padding: '0 4px'
                  }}>
                    🌐 Cambiar Red:
                  </div>
                  {supportedNetworks.map((network) => (
                    <button
                      key={network.chainId}
                      onClick={() => handleSwitchNetwork(network.chainId)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: chain?.id === network.chainId 
                          ? 'rgba(59, 130, 246, 0.2)' 
                          : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: chain?.id === network.chainId ? '#60a5fa' : '#e2e8f0',
                        cursor: 'pointer',
                        fontSize: '11px',
                        transition: 'all 0.2s ease',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        if (chain?.id !== network.chainId) {
                          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (chain?.id !== network.chainId) {
                          e.target.style.background = 'transparent';
                        }
                      }}
                    >
                      <span style={{
                        width: '6px',
                        height: '6px',
                        background: network.color,
                        borderRadius: '50%'
                      }}></span>
                      <span style={{ flex: 1 }}>
                        {network.name}
                      </span>
                      {network.isDefault && (
                        <span style={{
                          fontSize: '9px',
                          color: '#10b981',
                          fontWeight: '600'
                        }}>
                          DEFAULT
                        </span>
                      )}
                      {chain?.id === network.chainId && (
                        <span style={{
                          fontSize: '9px',
                          color: '#60a5fa',
                          fontWeight: '600'
                        }}>
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </motion.div>
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
              onClick={handleDisconnect}
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

        {/* Información de redes disponibles */}
        {showNetworkInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '11px',
              color: '#93c5fd'
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>
              🌐 Redes Disponibles (Wallet Social) - TESTNETS:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {supportedNetworks.map((network, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    background: network.color,
                    borderRadius: '50%'
                  }}></span>
                  <span style={{ fontWeight: index === 0 ? '600' : '400' }}>
                    {network.name}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '10px' }}>
                    - {network.description}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            color: '#fca5a5',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <FaExclamationTriangle />
          {error}
        </motion.div>
      )}
      
      <motion.button 
        onClick={handleConnect}
        disabled={isConnecting}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: isConnecting 
            ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          border: 'none',
          borderRadius: '12px',
          padding: '12px 24px',
          color: 'white',
          fontWeight: '700',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          cursor: isConnecting ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          backdropFilter: 'blur(10px)',
          opacity: isConnecting ? 0.7 : 1
        }}
        whileHover={!isConnecting ? { 
          scale: 1.02,
          boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
        } : {}}
        whileTap={!isConnecting ? { scale: 0.98 } : {}}
      >
        {isConnecting ? (
          <>
            <FaSync style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }} />
            <span>Conectando...</span>
          </>
        ) : (
          <>
            <FaWallet style={{ fontSize: '16px' }} />
            <span>Conectar Wallet</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default WalletConnect; 