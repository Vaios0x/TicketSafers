import React from 'react';
import { 
  DynamicConnectButton, 
  useDynamicContext,
  useIsLoggedIn
} from "@dynamic-labs/sdk-react-core";
import { motion } from 'framer-motion';
import { FaWallet, FaUser, FaSignOutAlt, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';
import '../../styles/connect-button.css';

const CustomDynamicConnectButton = () => {
  const { user, handleLogOut } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  // Función para copiar dirección
  const copyAddress = () => {
    if (user?.verifiedCredentials?.[0]?.address) {
      navigator.clipboard.writeText(user.verifiedCredentials[0].address);
      // Aquí podrías agregar un toast notification
    }
  };

  // Función para abrir en explorador
  const openInExplorer = () => {
    if (user?.verifiedCredentials?.[0]?.address) {
      const address = user.verifiedCredentials[0].address;
      window.open(`https://etherscan.io/address/${address}`, '_blank');
    }
  };

  // Formatear dirección
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoggedIn && user) {
    return (
      <motion.div 
        className="dynamic-wallet-connected"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="wallet-info-display">
          <div className="wallet-avatar">
            <FaUser />
          </div>
          <div className="wallet-details">
            <div className="wallet-address">
              {formatAddress(user.verifiedCredentials?.[0]?.address)}
            </div>
            <div className="wallet-status">
              <span className="status-indicator"></span>
              Conectado
            </div>
          </div>
          <div className="wallet-actions">
            <button 
              className="action-btn copy-btn"
              onClick={copyAddress}
              title="Copiar dirección"
            >
              <FaCopy />
            </button>
            <button 
              className="action-btn explorer-btn"
              onClick={openInExplorer}
              title="Ver en explorador"
            >
              <FaExternalLinkAlt />
            </button>
            <button 
              className="action-btn logout-btn"
              onClick={handleLogOut}
              title="Desconectar"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <DynamicConnectButton
      buttonContainerClassName="dynamic-connect-container"
      buttonClassName="dynamic-connect-btn"
    >
      <motion.div 
        className="connect-button-content"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FaWallet className="wallet-icon" />
        <span className="connect-text">Conectar Wallet</span>
      </motion.div>
    </DynamicConnectButton>
  );
};

export default CustomDynamicConnectButton; 