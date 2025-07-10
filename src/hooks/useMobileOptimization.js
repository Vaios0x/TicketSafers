import { useState, useEffect } from 'react';

/**
 * Hook para detectar dispositivos móviles y optimizar animaciones
 */
export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Detectar si es dispositivo móvil
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    // Detectar dispositivos de baja potencia
    const checkLowPower = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
      const isSmallScreen = window.innerWidth <= 480;
      
      setIsLowPower(isSlowConnection || isSmallScreen);
    };

    // Detectar preferencia de movimiento reducido
    const checkReducedMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      const handleChange = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    };

    // Ejecutar verificaciones iniciales
    checkMobile();
    checkLowPower();
    const cleanup = checkReducedMotion();

    // Escuchar cambios de tamaño de ventana
    const handleResize = () => {
      checkMobile();
      checkLowPower();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cleanup();
    };
  }, []);

  // Configuraciones optimizadas para animaciones
  const getAnimationConfig = () => {
    if (prefersReducedMotion) {
      return {
        duration: 0.1,
        ease: 'easeOut',
        disableAnimations: true
      };
    }

    if (isLowPower) {
      return {
        duration: 0.6,
        ease: 'easeOut',
        disableAnimations: false
      };
    }

    if (isMobile) {
      return {
        duration: 0.7,
        ease: 'easeOut',
        disableAnimations: false
      };
    }

    return {
      duration: 0.8,
      ease: 'easeOut',
      disableAnimations: false
    };
  };

  // Configuraciones para Framer Motion
  const getMotionConfig = () => {
    const config = getAnimationConfig();
    
    return {
      initial: config.disableAnimations ? { opacity: 1 } : { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: config.duration,
        ease: config.ease
      },
      whileHover: config.disableAnimations ? {} : { scale: 1.03 },
      whileTap: config.disableAnimations ? {} : { scale: 0.97 }
    };
  };

  return {
    isMobile,
    isLowPower,
    prefersReducedMotion,
    getAnimationConfig,
    getMotionConfig
  };
};

export default useMobileOptimization; 