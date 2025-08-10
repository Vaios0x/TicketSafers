import React from 'react';

const ComplianceBanner = () => {
  return (
    <div className="w-full bg-amber-500/10 text-amber-100 border-y border-amber-400/20 py-2 px-4 text-center">
      <p className="text-xs md:text-sm leading-relaxed">
        <strong className="font-semibold">DEMO EXPERIMENTAL —</strong> TicketSafer es un proyecto en desarrollo y testing. No está regulado por autoridades financieras mexicanas y no procesa transacciones reales. Únicamente para fines educativos y demostrativos.
      </p>
      <p className="text-[11px] md:text-xs mt-1 text-amber-200/90">
        Los activos digitales/NFTs no constituyen instrumentos financieros, ni asesoría, ni oferta de inversión. No custodiamos fondos ni activos. Consulta
        {' '}<a href="/terminos" className="underline underline-offset-2 hover:text-amber-100 focus-ring">Términos</a>,{' '}
        <a href="/privacidad" className="underline underline-offset-2 hover:text-amber-100 focus-ring">Privacidad</a>{' '}y{' '}
        <a href="/seguridad" className="underline underline-offset-2 hover:text-amber-100 focus-ring">Seguridad</a>.
      </p>
    </div>
  );
};

export default ComplianceBanner;


