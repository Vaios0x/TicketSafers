import React from 'react';

const DisclaimerBanner = ({ position = 'top' }) => {
  const baseClasses = 'w-full text-xs sm:text-sm text-white/80 bg-amber-500/10 border-t border-b border-amber-400/25';
  const layoutClasses = 'px-3 sm:px-4 py-2';
  const wrapClasses = 'max-w-[1400px] mx-auto flex items-center gap-2';

  return (
    <div
      className={`${baseClasses} ${layoutClasses}`}
      role="region"
      aria-label="Aviso legal y de riesgos"
      data-position={position}
    >
      <div className={wrapClasses}>
        <span className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 font-bold">!</span>
        <p className="leading-snug">
          <strong>DEMO EXPERIMENTAL</strong> — Proyecto en pruebas, no regulado. Sin transacciones reales. Solo con fines educativos y demostrativos.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerBanner;


