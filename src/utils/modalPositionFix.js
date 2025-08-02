// ============================================
// UTILIDAD PARA FIJAR POSICIONAMIENTO DEL MODAL
// ============================================

export const fixModalPosition = () => {
  // Función para aplicar estilos al modal
  const applyModalStyles = () => {
    // Buscar el modal de Reown AppKit
    const modal = document.querySelector('[data-reown-modal]');
    if (modal) {
      console.log('🔧 Aplicando estilos de posicionamiento al modal...');
      
      // Forzar posicionamiento más bajo
      modal.style.position = 'fixed';
      modal.style.top = '60%';
      modal.style.left = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
      modal.style.zIndex = '9999';
      modal.style.maxWidth = '400px';
      modal.style.maxHeight = '60vh';
      modal.style.margin = '0';
      modal.style.paddingTop = '20px';
      
      // Aplicar estilos al contenedor del modal
      const modalContainer = document.querySelector('[data-reown-modal-container]');
      if (modalContainer) {
        modalContainer.style.marginTop = '80px';
        modalContainer.style.position = 'relative';
      }
      
      // Aplicar estilos al backdrop
      const backdrop = document.querySelector('[data-reown-backdrop]');
      if (backdrop) {
        backdrop.style.position = 'fixed';
        backdrop.style.top = '0';
        backdrop.style.left = '0';
        backdrop.style.width = '100vw';
        backdrop.style.height = '100vh';
        backdrop.style.background = 'rgba(0, 0, 0, 0.5)';
        backdrop.style.backdropFilter = 'blur(8px)';
        backdrop.style.zIndex = '9998';
      }
      
      console.log('✅ Estilos de posicionamiento aplicados');
    }
  };

  // Aplicar estilos inmediatamente
  applyModalStyles();

  // Observar cambios en el DOM para aplicar estilos cuando el modal aparezca
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.hasAttribute && node.hasAttribute('data-reown-modal')) {
            console.log('🎯 Modal detectado, aplicando estilos...');
            setTimeout(applyModalStyles, 50);
          }
        });
      }
    });
  });

  // Observar el body para detectar cuando se agrega el modal
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Retornar función para limpiar el observer
  return () => {
    observer.disconnect();
  };
};

// Función para aplicar estilos específicos para móviles
export const applyMobileStyles = () => {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    const modal = document.querySelector('[data-reown-modal]');
    if (modal) {
      modal.style.top = '65%';
      modal.style.maxHeight = '50vh';
    }
    
    const modalContainer = document.querySelector('[data-reown-modal-container]');
    if (modalContainer) {
      modalContainer.style.marginTop = '60px';
    }
  }
};

// Función para aplicar estilos específicos para pantallas pequeñas
export const applySmallScreenStyles = () => {
  const isSmallScreen = window.innerWidth <= 480;
  
  if (isSmallScreen) {
    const modal = document.querySelector('[data-reown-modal]');
    if (modal) {
      modal.style.top = '70%';
      modal.style.maxHeight = '45vh';
    }
    
    const modalContainer = document.querySelector('[data-reown-modal-container]');
    if (modalContainer) {
      modalContainer.style.marginTop = '40px';
    }
  }
};

// Función principal que aplica todos los estilos
export const applyAllModalStyles = () => {
  fixModalPosition();
  applyMobileStyles();
  applySmallScreenStyles();
}; 