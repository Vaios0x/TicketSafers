import React from 'react';

const DisclaimerBanner = ({ position = 'top' }) => {
  const baseClasses = 'w-full text-sm md:text-base text-white/90 bg-amber-500/10 border border-amber-400/30';
  const layoutClasses = 'px-4 md:px-6 py-3 md:py-4';
  const wrapClasses = 'max-w-[1400px] mx-auto flex items-start md:items-center gap-3';

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
          <strong>DEMO EXPERIMENTAL</strong> — TicketSafer es un proyecto en desarrollo y testing. No está regulado por autoridades financieras mexicanas y no procesa transacciones reales. Únicamente para fines educativos y demostrativos. No constituye oferta de valores, servicios financieros ni captación de recursos del público conforme a la Ley para Regular las Instituciones de Tecnología Financiera. Los «activos virtuales» no son moneda de curso legal en México (criterios Banxico/CNBV). Para evitar confusiones, toda referencia a pagos, transferencias o "wallets" es simulada.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerBanner;


