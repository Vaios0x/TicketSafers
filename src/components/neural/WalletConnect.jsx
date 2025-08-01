import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaUser, FaSignOutAlt, FaCopy, FaExternalLinkAlt, FaNetworkWired, FaExclamationTriangle, FaSync, FaInfoCircle } from 'react-icons/fa';
import { useAccount, useDisconnect } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';

const WalletConnect = () => {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);

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
      const explorerUrl = chain.blockExplorers?.default?.url || 'https://etherscan.io';
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
      case 1: return '#627eea'; // Ethereum blue
      case 137: return '#8247e5'; // Polygon purple
      case 42161: return '#28a0f0'; // Arbitrum blue
      case 10: return '#ff0420'; // Optimism red
      case 8453: return '#0052ff'; // Base blue
      case 534352: return '#ff6b35'; // Scroll orange
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

  // Información de redes soportadas
  const supportedNetworks = [
    { name: 'Arbitrum One', color: '#28a0f0', description: 'L2 Económico (Por defecto)' },
    { name: 'Polygon', color: '#8247e5', description: 'L2 Escalable' },
    { name: 'Optimism', color: '#ff0420', description: 'L2 Rápido' },
    { name: 'Base', color: '#0052ff', description: 'L2 de Coinbase' },
    { name: 'Scroll', color: '#ff6b35', description: 'L2 ZK-Rollup' },
    { name: 'Ethereum', color: '#627eea', description: 'Red Principal' }
  ];

  if (isConnected && address) {
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
              🌐 Redes Disponibles (Wallet Social):
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