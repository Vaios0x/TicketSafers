import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaQrcode, FaTicketAlt, FaSearch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import '../../styles/verify-ticket.css';

const VerifyTicketPage = () => {
  const [ticketId, setTicketId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulación de verificación - Aquí irá la lógica real de verificación
    setTimeout(() => {
      // Ejemplo de resultado
      setVerificationResult({
        isValid: true,
        ticketInfo: {
          eventName: "Vive Latino 2025",
          eventDate: "2025-03-20",
          ticketType: "VIP",
          ownerAddress: "0x1234...5678",
          chain: "Ethereum",
          tokenId: "#123456"
        }
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="verify-ticket-page">
      <motion.div 
        className="verify-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="verify-header">
          <FaQrcode className="header-icon" />
          <h1>Verificar Ticket NFT</h1>
          <p>Verifica la autenticidad de cualquier ticket en nuestra plataforma</p>
        </div>

        <motion.form 
          className="verify-form"
          onSubmit={handleVerification}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="input-group">
            <FaTicketAlt className="input-icon" />
            <input
              type="text"
              placeholder="Ingresa el ID del ticket o Token ID"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              required
            />
          </div>
          <motion.button
            type="submit"
            className="verify-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              <>
                <FaSearch />
                <span>Verificar Ticket</span>
              </>
            )}
          </motion.button>
        </motion.form>

        {verificationResult && (
          <motion.div 
            className={`verification-result ${verificationResult.isValid ? 'valid' : 'invalid'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="result-header">
              {verificationResult.isValid ? (
                <>
                  <FaCheckCircle className="result-icon valid" />
                  <h2>Ticket Válido</h2>
                </>
              ) : (
                <>
                  <FaTimesCircle className="result-icon invalid" />
                  <h2>Ticket No Válido</h2>
                </>
              )}
            </div>
            
            {verificationResult.isValid && (
              <div className="ticket-info">
                <div className="info-row">
                  <span className="label">Evento:</span>
                  <span className="value">{verificationResult.ticketInfo.eventName}</span>
                </div>
                <div className="info-row">
                  <span className="label">Fecha:</span>
                  <span className="value">{verificationResult.ticketInfo.eventDate}</span>
                </div>
                <div className="info-row">
                  <span className="label">Tipo:</span>
                  <span className="value">{verificationResult.ticketInfo.ticketType}</span>
                </div>
                <div className="info-row">
                  <span className="label">Propietario:</span>
                  <span className="value">{verificationResult.ticketInfo.ownerAddress}</span>
                </div>
                <div className="info-row">
                  <span className="label">Red:</span>
                  <span className="value">{verificationResult.ticketInfo.chain}</span>
                </div>
                <div className="info-row">
                  <span className="label">Token ID:</span>
                  <span className="value">{verificationResult.ticketInfo.tokenId}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyTicketPage; 