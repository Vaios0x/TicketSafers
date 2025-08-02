import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaTicketAlt, 
  FaCalendarAlt, 
  FaUsers, 
  FaQuestionCircle, 
  FaChartLine,
  FaChevronDown, 
  FaRoad, 
  FaPlus,
  FaQrcode 
} from 'react-icons/fa';
import WalletConnect from './WalletConnect';

const menuItems = [
  {
    title: 'INICIO',
    path: '/',
    icon: <FaTicketAlt />,
    description: 'Página principal'
  },
  {
    title: 'EVENTOS',
    path: '/eventos',
    icon: <FaCalendarAlt />,
    description: 'Explora todos los eventos'
  },
  {
    title: 'CREAR EVENTO',
    path: '/crear-evento',
    icon: <FaPlus />,
    description: 'Crea tu propio evento',
    highlight: true
  },
  {
    title: 'VERIFICAR TICKET',
    path: '/verificar-ticket',
    icon: <FaQrcode />,
    description: 'Verifica la autenticidad de un ticket',
    highlight: true
  },
  {
    title: 'ACERCA DE',
    path: '/acerca-de',
    icon: <FaUsers />,
    description: 'Conoce más sobre nosotros',
    hasSubmenu: true,
    submenu: [
      {
        title: 'Sobre Nosotros',
        path: '/acerca-de',
        icon: <FaUsers />,
        description: 'Información sobre TicketSafer'
      },
      {
        title: 'Roadmap',
        path: '/roadmap',
        icon: <FaRoad />,
        description: 'Plan de desarrollo y futuro'
      }
    ]
  },
  {
    title: 'FAQ',
    path: '/faq',
    icon: <FaQuestionCircle />,
    description: 'Preguntas frecuentes'
  },
  {
    title: 'PERFIL',
    path: '/perfil',
    icon: <FaChartLine />,
    description: 'Tu perfil completo con dashboard'
  }
];

const NeuralMenu = () => {
  const [activeItem, setActiveItem] = useState('/');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest('.has-submenu')) {
        setActiveSubmenu(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setActiveSubmenu(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  const handleSubmenuToggle = (itemTitle) => {
    setActiveSubmenu(activeSubmenu === itemTitle ? null : itemTitle);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setActiveSubmenu(null);
    }
  };

  const handleOverlayClick = () => {
    setIsMobileMenuOpen(false);
    setActiveSubmenu(null);
  };

  const renderMenuItem = (item) => {
    if (item.hasSubmenu) {
      return (
        <motion.div
          key={item.path}
          className={`menu-item has-submenu ${activeSubmenu === item.title ? 'active' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            className={`nav-link ${activeItem === item.path ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`}
            onClick={() => handleSubmenuToggle(item.title)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.title}</span>
            <FaChevronDown 
              style={{ 
                marginLeft: 'auto',
                transition: 'transform 0.3s ease',
                transform: activeSubmenu === item.title ? 'rotate(180deg)' : 'rotate(0deg)'
              }} 
            />
          </button>
          
          <motion.div
            className="submenu"
            initial={false}
            animate={{
              height: activeSubmenu === item.title ? 'auto' : 0,
              opacity: activeSubmenu === item.title ? 1 : 0
            }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              marginTop: '8px',
              maxWidth: '100%',
              overflowX: 'hidden'
            }}
          >
            {item.submenu.map((subItem) => (
              <Link
                key={subItem.path}
                to={subItem.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  color: '#94a3b8',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
                onClick={() => {
                  setActiveItem(subItem.path);
                  setActiveSubmenu(null);
                  setIsMobileMenuOpen(false);
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span className="submenu-icon">{subItem.icon}</span>
                <span className="submenu-text">{subItem.title}</span>
              </Link>
            ))}
          </motion.div>
          
          <div className="menu-tooltip">
            <span>{item.description}</span>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={item.path}
        className={`menu-item ${item.highlight ? 'highlight' : ''}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link
          to={item.path}
          className={`nav-link ${activeItem === item.path ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`}
          onClick={() => {
            setActiveItem(item.path);
            setIsMobileMenuOpen(false);
          }}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-text">{item.title}</span>
          {activeItem === item.path && (
            <motion.div
              className="nav-indicator"
              layoutId="indicator"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            />
          )}
        </Link>
        <div className="menu-tooltip">
          <span>{item.description}</span>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <div className={`menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={handleOverlayClick}></div>
      <div className={`neural-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="neural-logo" onClick={() => setActiveItem('/')}>
            <div className="logo-icon">
              <div className="logo-ring"></div>
              <div className="logo-ring"></div>
              <div className="logo-ring"></div>
            </div>
            <span className="logo-text">TicketSafer</span>
          </Link>

          <button 
            className={`menu-btn ${isMobileMenuOpen ? 'active' : ''}`} 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
          </button>

          <nav className={`neural-nav ${isMobileMenuOpen ? 'active' : ''}`}>
            <div className="nav-links">
              {menuItems.map(renderMenuItem)}
            </div>
            <WalletConnect />
          </nav>
        </div>
      </div>
    </>
  );
};

export default NeuralMenu; 