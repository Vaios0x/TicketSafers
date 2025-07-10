import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useEnsName, useEnsAvatar, useChainId } from 'wagmi';
import { useConnectModal, useAccountModal, useChainModal } from '@rainbow-me/rainbowkit';

/**
 * Hook personalizado para gestionar la conexión de wallet
 * Proporciona una interfaz simplificada y optimizada para la aplicación
 */
export const useWallet = () => {
  // Hooks de wagmi
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  
  // Hooks de RainbowKit para modales
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  // Hook para obtener balance
  const { data: balance, isLoading: isLoadingBalance } = useBalance({
    address,
    enabled: !!address,
  });

  // Hook para ENS
  const { data: ensName } = useEnsName({
    address,
    enabled: !!address,
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName,
    enabled: !!ensName,
  });

  // ========================================
  // FUNCIONES DE CONEXIÓN
  // ========================================

  /**
   * Conectar wallet
   */
  const connectWallet = async (connectorId) => {
    try {
      const connector = connectors.find(c => c.id === connectorId);
      if (!connector) {
        throw new Error(`Connector ${connectorId} no encontrado`);
      }

      await connect({ connector });
    } catch (error) {
      console.error('Error conectando wallet:', error);
      throw error;
    }
  };

  /**
   * Desconectar wallet
   */
  const disconnectWallet = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Error desconectando wallet:', error);
      throw error;
    }
  };

  // ========================================
  // FUNCIONES DE UTILIDAD
  // ========================================

  /**
   * Formatear dirección para mostrar
   */
  const formatAddress = (addr = address, startLength = 6, endLength = 4) => {
    if (!addr) return '';
    return `${addr.slice(0, startLength)}...${addr.slice(-endLength)}`;
  };

  /**
   * Formatear balance para mostrar
   */
  const formatBalance = (bal = balance, decimals = 4) => {
    if (!bal) return '0';
    return parseFloat(bal.formatted).toFixed(decimals);
  };

  // ========================================
  // ESTADO DERIVADO
  // ========================================

  const displayName = ensName || formatAddress();
  const hasBalance = balance && parseFloat(balance.formatted) > 0;

  const walletInfo = {
    address,
    ensName,
    ensAvatar,
    displayName,
    balance,
    formattedBalance: formatBalance(),
    hasBalance,
    isLoadingBalance,
  };

  const connectionState = {
    isConnected,
    isConnecting,
    isDisconnected,
    hasError: !!connectError,
    error: connectError,
  };

  const chainInfo = {
    isSupported: true, // Simplificado por ahora
    current: null,
  };

  // ========================================
  // FUNCIONES DE MODAL
  // ========================================

  const modals = {
    openConnect: () => {
      openConnectModal?.();
    },
    openAccount: () => {
      openAccountModal?.();
    },
    openChain: () => {
      openChainModal?.();
    },
  };

  // ========================================
  // RETURN DEL HOOK
  // ========================================

  return {
    // Estado de la wallet
    ...walletInfo,
    ...connectionState,
    ...chainInfo,

    // Funciones de conexión
    connect: connectWallet,
    disconnect: disconnectWallet,

    // Modales
    modals,

    // Utilidades
    formatAddress,
    formatBalance,

    // Datos avanzados
    connectors,
    rawBalance: balance,
    rawError: connectError,
  };
};

/**
 * Hook para detectar cambios en la wallet
 */
export const useWalletEvents = () => {
  const { address, isConnected } = useAccount();
  const [previousAddress, setPreviousAddress] = useState(address);
  const [previousConnection, setPreviousConnection] = useState(isConnected);

  useEffect(() => {
    // Detectar cambio de cuenta
    if (address !== previousAddress) {
      setPreviousAddress(address);
    }

    // Detectar cambio de conexión
    if (isConnected !== previousConnection) {
      setPreviousConnection(isConnected);
    }
  }, [address, isConnected, previousAddress, previousConnection]);

  return {
    hasAccountChanged: address !== previousAddress,
    hasConnectionChanged: isConnected !== previousConnection,
  };
};

/**
 * Hook para estado de la transacción
 */
export const useTransactionState = () => {
  const [transactions, setTransactions] = useState([]);
  const [isTransacting, setIsTransacting] = useState(false);

  const addTransaction = (tx) => {
    setTransactions(prev => [
      { ...tx, timestamp: Date.now() },
      ...prev.slice(0, 9) // Mantener solo las últimas 10
    ]);
  };

  const updateTransaction = (hash, updates) => {
    setTransactions(prev =>
      prev.map(tx =>
        tx.hash === hash ? { ...tx, ...updates } : tx
      )
    );
  };

  const clearTransactions = () => {
    setTransactions([]);
  };

  return {
    transactions,
    isTransacting,
    setIsTransacting,
    addTransaction,
    updateTransaction,
    clearTransactions,
  };
};

export default useWallet; 