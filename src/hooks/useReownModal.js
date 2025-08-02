import { useEffect, useCallback } from 'react';
import { useAppKit } from '@reown/appkit/react';

export const useReownModal = () => {
  const { open, close } = useAppKit();

  // Función para abrir el modal con posicionamiento mejorado
  const openModal = useCallback(() => {
    // Forzar el posicionamiento del modal después de abrirlo
    setTimeout(() => {
      const modal = document.querySelector('[data-reown-modal]');
      if (modal) {
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.zIndex = '9999';
        modal.style.maxWidth = '400px';
        modal.style.maxHeight = '80vh';
        modal.style.margin = '0';
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
    }, 100);

    open();
  }, [open]);

  // Efecto para aplicar estilos cuando el modal se monta
  useEffect(() => {
    const applyModalStyles = () => {
      const modal = document.querySelector('[data-reown-modal]');
      if (modal) {
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.zIndex = '9999';
        modal.style.maxWidth = '400px';
        modal.style.maxHeight = '80vh';
        modal.style.margin = '0';
      }
    };

    // Observar cambios en el DOM para aplicar estilos cuando el modal aparezca
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.hasAttribute && node.hasAttribute('data-reown-modal')) {
              applyModalStyles();
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    open: openModal,
    close
  };
}; 