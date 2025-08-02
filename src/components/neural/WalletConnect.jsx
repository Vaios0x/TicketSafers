import React from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaUser, FaSignOutAlt, FaCopy, FaExternalLinkAlt, FaNetworkWired } from 'react-icons/fa';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';

const WalletConnect = () => {
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { data: balance } = useBalance({
    address: address,
  });

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
      let explorerUrl = 'https://etherscan.io'; // Default
      
      switch (chainId) {
        // MAINNET
        case 1:
          explorerUrl = 'https://etherscan.io';
          break;
        case 137:
          explorerUrl = 'https://polygonscan.com';
          break;
        case 42161:
          explorerUrl = 'https://arbiscan.io';
          break;
        case 10:
          explorerUrl = 'https://optimistic.etherscan.io';
          break;
        case 8453:
          explorerUrl = 'https://basescan.org';
          break;
        case 534352:
          explorerUrl = 'https://scrollscan.com';
          break;
        case 56:
          explorerUrl = 'https://bscscan.com';
          break;
        case 43114:
          explorerUrl = 'https://snowtrace.io';
          break;
        
        // TESTNET
        case 11155111:
          explorerUrl = 'https://sepolia.etherscan.io';
          break;
        case 421614:
          explorerUrl = 'https://sepolia.arbiscan.io';
          break;
        case 84532:
          explorerUrl = 'https://sepolia.basescan.org';
          break;
        case 534351:
          explorerUrl = 'https://sepolia.scrollscan.com';
          break;
        case 80002:
          explorerUrl = 'https://amoy.polygonscan.com';
          break;
        case 11155420:
          explorerUrl = 'https://sepolia-optimism.etherscan.io';
          break;
        case 97:
          explorerUrl = 'https://testnet.bscscan.com';
          break;
        case 43113:
          explorerUrl = 'https://testnet.snowtrace.io';
          break;
        default:
          explorerUrl = 'https://etherscan.io';
      }
      
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
    switch (chainId) {
      // MAINNET
      case 1: return 'Ethereum';
      case 137: return 'Polygon';
      case 42161: return 'Arbitrum';
      case 10: return 'Optimism';
      case 8453: return 'Base';
      case 534352: return 'Scroll';
      case 56: return 'BSC';
      case 43114: return 'Avalanche';
      
      // TESTNET
      case 11155111: return 'Sepolia';
      case 421614: return 'Arbitrum Sepolia';
      case 84532: return 'Base Sepolia';
      case 534351: return 'Scroll Sepolia';
      case 80002: return 'Polygon Amoy';
      case 11155420: return 'Optimism Sepolia';
      case 97: return 'BSC Testnet';
      case 43113: return 'Avalanche Fuji';
      default: return 'Unknown';
    }
  };

  // Obtener color de la red
  const getNetworkColor = () => {
    switch (chainId) {
      case 1: case 11155111: return '#627eea'; // Ethereum blue
      case 137: case 80002: return '#8247e5'; // Polygon purple
      case 42161: case 421614: return '#28a0f0'; // Arbitrum blue
      case 10: case 11155420: return '#ff0420'; // Optimism red
      case 8453: case 84532: return '#0052ff'; // Base blue
      case 534352: case 534351: return '#fefefe'; // Scroll white
      case 56: case 97: return '#f3ba2f'; // BSC yellow
      case 43114: case 43113: return '#e84142'; // Avalanche red
      default: return '#6b7280'; // Gray
    }
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
              <span style={{ marginLeft: '8px', color: '#10b981' }}>
                {formatBalance(balance)} {balance.symbol}
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
            onClick={disconnect}
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