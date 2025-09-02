import React from 'react';
import { motion } from 'framer-motion';
import { FaGasPump, FaShieldAlt, FaRocket, FaCoins, FaLayerGroup } from 'react-icons/fa';

const BasePage = () => {
  const stats = [
    { label: 'Eventos Activos', value: '756', icon: <FaRocket /> },
    { label: 'Tickets Vendidos', value: '32,189', icon: <FaCoins /> },
    { label: 'Gas Promedio', value: '~$0.05', icon: <FaGasPump /> },
    { label: 'Uptime', value: '99.9%', icon: <FaShieldAlt /> }
  ];

  const features = [
    {
      title: 'Gas Ultra Bajo',
      description: 'Transacciones por centavos, ideal para eventos masivos',
      icon: <FaGasPump />
    },
    {
      title: 'Seguridad Coinbase',
      description: 'Respaldado por Coinbase, máxima confiabilidad',
      icon: <FaShieldAlt />
    },
    {
      title: 'Velocidad L2',
      description: 'Confirmaciones en 2 segundos',
      icon: <FaRocket />
    }
  ];

  return (
    <div className="blockchain-page base">
      <motion.div className="blockchain-hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="neural-container">
          <div className="hero-content">
            <motion.div className="chain-logo" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
              <div className="base-icon">⬣</div>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
              Base
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
              La Layer 2 oficial de Coinbase. Seguridad institucional con costos mínimos para eventos masivos.
            </motion.p>
          </div>
        </div>
      </motion.div>

      <section className="blockchain-stats">
        <div className="neural-container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="blockchain-features">
        <div className="neural-container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            ¿Por qué elegir Base?
          </motion.h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="blockchain-cta">
        <div className="neural-container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <h2>¿Listo para crear eventos en Base?</h2>
            <p>Únete a la revolución de tickets NFT en la Layer 2 más confiable</p>
            <motion.button
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Crear Evento en Base
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BasePage;
