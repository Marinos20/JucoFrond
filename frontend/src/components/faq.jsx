
'use client'

import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

export default function Faq() {
    const faqItems = [
{
  id: 'item-1',
  question: 'Comment soumettre un projet pour financement sur la plateforme ?',
  answer: 'La soumission de projet se fait en ligne via un formulaire structuré. Le porteur de projet renseigne les informations clés : description, objectifs, budget prévisionnel, durée et impact attendu. Une fois soumis, le projet est enregistré et passe en phase d’analyse.',
},
{
  id: 'item-2',
  question: 'Quels types de projets peuvent être financés ?',
  answer: 'La plateforme accepte des projets éducatifs, technologiques, agricoles, sociaux et entrepreneuriaux. Chaque projet doit démontrer une utilité claire, un plan de financement cohérent et un impact mesurable sur la communauté.',
},
{
  id: 'item-3',
  question: 'Comment fonctionne le processus de sélection des projets ?',
  answer: 'Après soumission, les projets sont évalués selon des critères précis : viabilité, faisabilité, impact social et transparence financière. Les projets validés sont ensuite publiés pour financement ou présentés aux partenaires financiers.',
},
{
  id: 'item-4',
  question: 'Comment les financements sont-ils versés aux porteurs de projets ?',
  answer: 'Les fonds sont débloqués par tranches selon l’avancement du projet. Chaque étape nécessite un rapport ou une preuve d’exécution, garantissant ainsi une utilisation responsable et transparente des ressources.',
},
{
  id: 'item-5',
  question: 'Les investisseurs ou contributeurs sont-ils protégés ?',
  answer: 'Oui. La plateforme met en place des mécanismes de suivi, de traçabilité des fonds et de reporting régulier. Les contributeurs peuvent consulter l’évolution du projet et l’utilisation des financements en temps réel.',
},
{
  id: 'item-6',
  question: 'Puis-je suivre l’évolution de mon projet après financement ?',
  answer: 'Absolument. Un tableau de bord dédié permet au porteur de projet de suivre les financements reçus, les échéances, les rapports soumis et les interactions avec les financeurs, le tout sur une seule interface.',
},
{
  id: 'item-7',
  question: 'Y a-t-il des frais pour soumettre ou financer un projet ?',
  answer: 'La soumission de projet est gratuite. Une commission transparente peut s’appliquer uniquement sur les fonds effectivement levés, afin d’assurer le fonctionnement, la sécurité et l’accompagnement de la plateforme.',
},
{
  id: 'item-8',
  question: 'La plateforme accompagne-t-elle les porteurs de projets ?',
  answer: 'Oui. Les porteurs de projets bénéficient d’un accompagnement stratégique : amélioration du dossier, conseils financiers et suivi post-financement afin d’augmenter les chances de réussite du projet.',
},

    ]

    return (
        <section id="faq" className="py-24 md:py-32 bg-slate-50/30">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6">
                        Support & Aide
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-6">
                        Des réponses à vos <br />
                        <span className="text-indigo-600">questions.</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium">Tout ce qu’il faut savoir pour bénéficier des financements en toute sérénité.</p>
                </div>

                <div className="mx-auto max-w-2xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full bg-white rounded-[2.5rem] border border-slate-100 px-8 py-4 shadow-xl shadow-slate-200/40">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-slate-50 last:border-0 ">
                                <AccordionTrigger className="text-left text-slate-900 py-6 font-semibold cursor-pointer">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent>
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="mt-12 p-8 bg-slate-900 rounded-[2rem] text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <p className="text-slate-400 font-medium relative z-10">
                            Vous ne trouvez pas votre réponse ?{' '}
                            <a
  href="mailto:banque.investissement@gmail.com?subject=Demande%20d'information%20sur%20le%20financement%20de%20projet&body=Bonjour,%0A%0AJe%20n'ai%20pas%20trouvé%20la%20réponse%20à%20ma%20question%20concernant%20la%20soumission%20ou%20le%20financement%20de%20projet.%0A%0AMerci."
  className="text-white font-black hover:text-indigo-400 transition-colors underline underline-offset-4 decoration-indigo-500"
>
  Contactez notre équipe support 24/7
</a>

                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
