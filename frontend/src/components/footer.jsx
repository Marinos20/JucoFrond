
import React, { useState } from 'react';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Moon, 
  Sun, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';


export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const year = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
  ];

  const quickLinks = [
    { name: 'Accueil', href: '#' },
    { name: 'Fonctionnalités', href: '#features' },
    { name: 'Solution', href: '#features' },
    { name: 'Témoignages', href: '#testimonials' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <footer className="relative border-t border-slate-100 bg-white text-slate-900 pt-20 pb-10 overflow-hidden font-sans">
      {/* Glow Effect Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Newsletter Column */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tighter text-slate-900">
              Restons <span className="text-indigo-600">connectés.</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Rejoignez notre newsletter et découvrez les opportunités pour financer vos projets.
            </p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 pl-6 pr-14 bg-slate-50 border border-slate-200 rounded-full text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <Send size={18} />
              </button>
            </form>
          </div>

          {/* Quick Links Column */}
          <div className="lg:pl-12">
            <h3 className="mb-6 text-xs font-black uppercase  text-slate-400">Navigation</h3>
            <nav className="space-y-4">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-sm font-bold text-slate-600 hover:text-indigo-600 hover:translate-x-1 transition-all"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="mb-6 text-xs font-black uppercase  text-slate-400">Contact</h3>
            <address className="space-y-5 not-italic">
              <div className="flex items-start gap-3 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                  <MapPin size={18} />
                </div>
                <p className="text-sm font-bold text-slate-600 leading-relaxed">
                  Union européenne,,<br />Bruxelles, Belgique
                </p>
              </div>
              <a
  href="https://wa.me/34695970359"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-3 group"
>
  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-green-600 group-hover:bg-green-50 transition-colors">
    <Phone size={18} />
  </div>
  <p className="text-sm font-bold text-slate-600 group-hover:text-green-600">
    +34 695 97 03 59
  </p>
</a>

              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                  <Mail size={18} />
                </div>
                <p className="text-sm font-bold text-slate-600">direction@eurofinancement.com
</p>
              </div>
            </address>
          </div>

          {/* Socials & Theme Column */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="mb-6 text-xs font-black uppercase  text-slate-400">Suivez-nous</h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 transition-all duration-300 hover:text-white hover:-translate-y-1 hover:shadow-xl ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            
          </div>
        </div>

        
      </div>
    </footer>
  );
};
