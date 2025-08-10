import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaCog, 
  FaSignOutAlt, 
  FaWallet,
  FaChartLine,
  FaHistory,
  FaCamera,
  FaEdit,
  FaChevronDown
} from 'react-icons/fa';
import '../../styles/navbar.css';

const NeuralNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Usuario Demo',
    email: 'usuario@ticketsafer.com',
    avatar: null,
    walletAddress: '0x8c...A343'
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const menuItems = [
    {
      id: "inicio",
      title: "INICIO",
      path: "/"
    },
    {
      id: "acerca",
      title: "ACERCA DE",
      path: "/about"
    },
    {
      id: "roadmap",
      title: "ROADMAP",
      path: "/roadmap"
    },
    {
      id: "faq",
      title: "FAQ",
      path: "/faq"
    }
  ];

  const profileMenuItems = [
    {
      id: 'perfil',
      title: 'Mi Perfil',
      icon: FaUser,
      path: '/profile'
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: FaChartLine,
      path: '/dashboard'
    },
    {
      id: 'configuracion',
      title: 'Configuración',
      icon: FaCog,
      path: '/profile?tab=configuracion'
    },
    {
      id: 'historial',
      title: 'Historial',
      icon: FaHistory,
      path: '/profile?tab=historial'
    }
  ];

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleMenuClick = (path) => {
    setShowProfileMenu(false);
    // Aquí se podría agregar navegación
    console.log('Navegando a:', path);
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    // Aquí se podría agregar lógica de logout
    console.log('Cerrando sesión...');
  };

  return (
    <motion.nav 
      className={`neural-navbar ${isScrolled ? 'scrolled' : ''} sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="neural-navbar-container">
        {/* Logo Neural */}
        <motion.div 
          className="neural-logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="logo-neural-rings">
            <div className="neural-ring neural-ring-1"></div>
            <div className="neural-ring neural-ring-2"></div>
            <div className="neural-ring neural-ring-3"></div>
          </div>
          <span className="logo-symbol">🎫</span>
          <div className="logo-text-neural select-none">
            <span className="logo-main">TicketSafer</span>
            <span className="logo-subtitle">NFT Tickets</span>
          </div>
        </motion.div>

        {/* Menu Neural */}
        <div className="neural-menu">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="neural-menu-item"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <a href={item.path} className="neural-item-button focus-ring">
                <span className="item-label">{item.title}</span>
                <div className="neural-glow-indicator"></div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Profile Menu */}
        <div className="profile-menu-container">
          <motion.button
            className="profile-menu-trigger focus-ring"
            onClick={handleProfileClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="profile-avatar">
              {profileData.avatar ? (
                <img 
                  src={profileData.avatar} 
                  alt={profileData.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="avatar-placeholder" style={{display: profileData.avatar ? 'none' : 'flex'}}>
                <FaUser />
              </div>
              <button className="avatar-edit-btn">
                <FaCamera />
              </button>
            </div>
            <div className="profile-info">
              <span className="profile-name">{profileData.name}</span>
              <span className="profile-wallet">{profileData.walletAddress}</span>
            </div>
            <FaChevronDown className={`profile-arrow ${showProfileMenu ? 'rotated' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div 
                className="profile-dropdown"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {profileData.avatar ? (
                      <img 
                        src={profileData.avatar} 
                        alt={profileData.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="avatar-placeholder" style={{display: profileData.avatar ? 'none' : 'flex'}}>
                      <FaUser />
                    </div>
                  </div>
                  <div className="dropdown-user-info">
                    <h4>{profileData.name}</h4>
                    <p>{profileData.email}</p>
                    <span className="wallet-badge">
                      <FaWallet />
                      {profileData.walletAddress}
                    </span>
                  </div>
                </div>

                <div className="dropdown-menu">
                  {profileMenuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        className="dropdown-item"
                        onClick={() => handleMenuClick(item.path)}
                      >
                        <IconComponent />
                        <span>{item.title}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="dropdown-footer">
                  <button className="dropdown-item logout-btn focus-ring" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default NeuralNavbar; 