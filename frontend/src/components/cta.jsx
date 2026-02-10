import React from 'react'
import { ArrowRight } from 'lucide-react'

export const Cta = () => {
  return (
    <section
      id="contact"
      className="py-32 px-6 bg-white border-t border-slate-100"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-slate-900 mb-6">
          Passez à l’étape du financement
        </h2>

        <p className="text-xl text-slate-500 mb-10 font-normal">
          Ils sont déjà des milliers à nous faire confiance
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="h-12 px-8 rounded-full cursor-pointer bg-slate-900 text-white font-medium text-base hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2">
            Destiné aux entrepreneurs
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="mailto:direction@eurofinancement.com"
            className="text-slate-500 hover:text-slate-900 font-medium transition-colors px-6 py-3"
          >
            Contacter le support
          </a>
        </div>
      </div>
    </section>
  )
}
