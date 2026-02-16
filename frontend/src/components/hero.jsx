import React from 'react';
import { ArrowRight } from 'lucide-react';
import DotGrid from './ui/DotGrid';

export const Hero = ({ onSubmitProjectClick }) => {
  const whatsappNumber = '34695970359'; // format international sans +
  const whatsappMessage = encodeURIComponent(
    "Bonjour, je souhaite soumettre un projet pour financement. Pouvez-vous m'indiquer la procédure ?"
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <section className="min-h-screen relative z-10 pb-24 md:pt-56 md:pb-32 px-6 bg-white overflow-hidden">
      {/* DotGrid Background */}
      <div className="absolute inset-0 z-0">
        <DotGrid
          className="h-full w-full"
          dotSize={8}
          gap={22}
          baseColor="#E5E7EB"
          activeColor="#6366F1"
          proximity={120}
          shockRadius={220}
          shockStrength={4}
          resistance={800}
          returnDuration={1.4}
        />
      </div>

      {/* Soft Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-50/60 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white/70 backdrop-blur text-slate-600 text-[11px] font-semibold uppercase tracking-wider mb-8">
            Financez vos projets
          </div>
        </div>

        {/* Title */}
        <h1 className="animate-fade-up delay-100 text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-slate-900 mb-8 leading-[1.05]">
          Soutenir les projets à fort impact<br />
          <span className="text-indigo-600">économique et social.</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up delay-200 text-lg md:text-xl text-slate-500 mb-12 max-w-xl mx-auto font-medium leading-relaxed">
          Un mécanisme de financement structuré au service du développement durable et de l’innovation.
        </p>

        {/* CTA */}
        <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onSubmitProjectClick} // optionnel (tu peux supprimer)
            className="h-12 px-8 rounded-full bg-slate-900 cursor-pointer text-white font-medium text-base hover:bg-black transition-all flex items-center gap-2 hover:scale-105 active:scale-95 duration-200 shadow-lg shadow-slate-900/20"
          >
            Soumettre un projet
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
  href="#features"
  className="h-12 px-8 rounded-full cursor-pointer text-slate-900 bg-slate-100 font-medium text-base hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 duration-200 inline-flex items-center justify-center"
>
  En savoir plus
</a>

        </div>
      </div>
    </section>
  );
};
