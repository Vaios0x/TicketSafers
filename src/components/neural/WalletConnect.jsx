import React from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaUser, FaSignOutAlt, FaCopy, FaExternalLinkAlt, FaNetworkWired } from 'react-icons/fa';
import { useAccount, useDisconnect } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';

const WalletConnect = () => {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();

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

  // Obtener color de la red - Solo las redes que soportamos
  const getNetworkColor = () => {
    if (!chain) return '#6b7280';
    
    switch (chain.id) {
      case 42161: return '#28a0f0'; // Arbitrum blue
      case 8453: return '#0052ff'; // Base blue
      case 10: return '#ff0420'; // Optimism red
      case 137: return '#8247e5'; // Polygon purple
      default: return '#6b7280'; // Gray para redes no soportadas
    }
  };

  // Verificar si la red está soportada
  const isSupportedNetwork = () => {
    if (!chain) return false;
    const supportedChainIds = [42161, 8453, 10, 137]; // Arbitrum, Base, Optimism, Polygon
    return supportedChainIds.includes(chain.id);
  };

  if (isConnected && address) {
    return (
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
            color: isSupportedNetwork() ? '#94a3b8' : '#ef4444'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              background: getNetworkColor(),
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></span>
            {getNetworkName()}
            {!isSupportedNetwork() && (
              <span style={{ color: '#ef4444', fontSize: '10px' }}>
                (No soportada)
              </span>
            )}
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
      onClick={open}
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
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        backdropFilter: 'blur(10px)'
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
      }}
      whileTap={{ scale: 0.98 }}
    >
      <FaWallet style={{ fontSize: '16px' }} />
      <span>Conectar Wallet</span>
    </motion.button>
  );
};

export default WalletConnect; 