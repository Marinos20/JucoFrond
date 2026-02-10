
import React from 'react';
import { cn } from '../lib/utils';
import {
  Check,
  Copy,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
} from 'lucide-react';
import { Button } from './ui/button';

const APP_EMAIL = 'direction@eurofinancement.com';
const APP_PHONE = '+34 695 97 03 59';
const APP_PHONE_2 = '+33 7 48 54 41 26 ';

export const ContactPage = () => {
  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <section id="contact" className="min-h-screen w-full bg-white relative overflow-hidden">
      <div className="mx-auto h-full max-w-6xl lg:border-x border-slate-100 relative">
        
        {/* Gradients de fond */}
        <div
          aria-hidden="true"
          className="absolute inset-0 isolate -z-10 opacity-40 pointer-events-none"
        >
          <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(79,70,229,0.08)_0,transparent_80%)] absolute top-0 left-0 h-[600px] w-[600px] -translate-y-1/2 -rotate-45 rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,rgba(79,70,229,0.04)_0,transparent_100%)] absolute top-0 left-0 h-[800px] w-[400px] [translate:5%_-50%] -rotate-45 rounded-full" />
        </div>

        <div className="flex grow flex-col justify-center px-6 md:px-12 pt-40 pb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6 w-fit">
            Contactez-nous
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6">
            Parlons de votre <br />
            <span className="text-indigo-600">Projet d'entreprise.</span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
            Notre équipe d’experts est prête à vous accompagner dans le financement et la réalisation de votre projet.
          </p>
        </div>

        <BorderSeparator />

        <div className="grid md:grid-cols-3 relative bg-white">
          <Box
            icon={Mail}
            title="Email"
            description="Nous répondons à toutes les demandes en moins de 24h."
          >
            <a
              href={`mailto:${APP_EMAIL}`}
              className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors text-[1.2rem]"
            >
              {APP_EMAIL}
            </a>
            <CopyButton textToCopy={APP_EMAIL} />
          </Box>
          <Box
            icon={MapPin}
            title="Bureau"
            description="Passez nous voir pour une démonstration en direct."
          >
            <span className="text-sm font-bold text-slate-900  leading-relaxed text-[1.2rem]">
              Commission européenne, <br />
              Bruxelles, Belgique
            </span>
          </Box>
          <Box
            icon={Phone}
            title="Téléphone"
            description="Disponible du Lun-Ven, 8h-18h."
            className="border-b-0 md:border-r-0"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-x-3">
                <a
                  href={`tel:${APP_PHONE}`}
                  className="block text-base font-bold text-slate-900 text-[1.2rem] hover:text-indigo-600 transition-colors"
                >
                  {APP_PHONE}
                </a>
                <CopyButton textToCopy={APP_PHONE} />
              </div>
              <div className="flex items-center gap-x-3">
                <a
                  href={`tel:${APP_PHONE_2}`}
                  className="block text-base font-bold text-[1.2rem] text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  {APP_PHONE_2}
                </a>
                <CopyButton textToCopy={APP_PHONE_2} />
              </div>
            </div>
          </Box>
        </div>

        <BorderSeparator />

        <div className="relative flex h-full min-h-[400px] items-center justify-center bg-slate-50/30">
          <div
            className={cn(
              'absolute inset-0 size-full pointer-events-none opacity-20',
              'bg-[radial-gradient(circle,rgba(0,0,0,0.1)_1px,transparent_1px)]',
              'bg-[size:32px_32px]',
              '[mask-image:radial-gradient(ellipse_at_center,white_30%,transparent)]',
            )}
          />

          <div className="relative z-1 space-y-10 text-center px-6">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
              Retrouvez-nous sur les réseaux
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-slate-900 hover:text-white transition-all duration-300 flex items-center gap-x-3 rounded-2xl border border-slate-100 px-6 py-4 shadow-sm hover:shadow-xl hover:-translate-y-1 group"
                >
                  <link.icon className="size-5 text-indigo-600 group-hover:text-white" />
                  <span className="font-bold text-sm tracking-tight">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function BorderSeparator() {
  return <div className="h-px w-full bg-slate-100" />;
}

function Box({ icon: Icon, title, description, children, className }) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between border-b border-slate-100 md:border-r md:border-b-0 group transition-colors hover:bg-slate-50/50',
        className,
      )}
    >
      <div className="bg-slate-50/50 flex items-center gap-x-3 border-b border-slate-100 p-6">
        <Icon className="text-indigo-600 size-5" strokeWidth={2.5} />
        <h2 className="text-sm font-black uppercase text-slate-400">{title}</h2>
      </div>
      <div className="flex flex-col gap-y-4 p-8 min-h-[160px] justify-center">{children}</div>
      <div className="border-t border-slate-100 p-6 bg-white/50">
        <p className="text-slate-400 text-[1rem] font-medium leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function CopyButton({ textToCopy, className }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Erreur de copie : ', err);
    }
  };

  return (
    <Button
  variant="ghost"
  size="sm"
  className="h-10 w-10 p-0 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 shadow-sm transition-all"
  onClick={handleCopy}
>
  {copied ? (
    <Check className="size-6 text-emerald-500" />
  ) : (
    <Copy className="size-6 text-slate-400" />
  )}
</Button>

  );
}
