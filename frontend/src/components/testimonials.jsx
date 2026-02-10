import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

/* =========================
   DATA
========================= */
const testimonials = [
  {
    id: 1,
    logo: "UE",
    quote:
      "Recherchant un financement depuis que j'ai perdu tous mes biens suite à un incendie, personne n'a voulu m'aider à cause de ma situation qui ne remplissait pas les conditions d'octroi d'un crédit. Mais grâce à DIRECT FINANCEMENT, j'ai pu bénéficier d'un don financier et je m'en suis sorti, je suis de nouveau mon propre chef.",
    name: "Dr. Koffi Mensah",
    role: "Entrepreuneur",
    avatar: "https://i.pravatar.cc/150?u=director",
    featured: true,
  },
  {
    id: 2,
    quote:
      "Toutes les transactions sont sécurisées, automatiquement enregistrées et accessibles, ce qui facilite la conformité et la redevabilité.",
    name: "Mme Amadou",
    role: "Gestionnaire Financière",
    avatar: "https://i.pravatar.cc/150?u=manager",
  },
  {
    id: 3,
    quote:
      "Rejeté par la banque et totalement désespéré, je me suis tourné vers DIRECT FINANCEMENT qui m'a octrouyé le financement dont j'ai besoin pour sauver ma structure en un temps record. Et le plus étonnant c'est que c'est non remboursable. Merci à toute l'équipe de DIRECT FINANCEMENT.",
    name: "Marc Houndété",
    role: "Bénéficiaire",
    avatar: "https://i.pravatar.cc/150?u=parent",
  },
  {
    id: 4,
    quote:
      "J'ai obtenu une subvention pour agrandir mon restaurant qui avant ne pouvait contenir que 8 tables. Maintenant j'ai beaucoup d'espace et depuis mon chiffre d'affaire a bien augmenté. je peux m'offrir des vacances à moi et à ma famille. Merci à vous.",
    name: "Sophie Lawson",
    role: "Secrétaire Générale",
    avatar: "https://i.pravatar.cc/150?u=admin",
  },
];

/* =========================
   ANIMATION VARIANTS
========================= */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const TestimonialsCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest">
            Témoignages
          </span>

          <h2 className="mt-6 text-4xl md:text-6xl font-black tracking-tight text-slate-900">
            Adopté par des
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-800">
              institutions de référence
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-500">
            Une solution éprouvée pour une gestion financière transparente,
            sécurisée et performante des projets éducatifs.
          </p>
        </motion.div>

        {/* CAROUSEL */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <motion.div
              className="flex gap-6"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {testimonials.map((t) => (
                <motion.div
                  key={t.id}
                  variants={fadeUp}
                  className="flex-[0_0_90%] md:flex-[0_0_45%] lg:flex-[0_0_32%]"
                >
                  <motion.div
                    whileHover={{
                      y: -8,
                      boxShadow:
                        "0 20px 40px rgba(0,0,0,0.08)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="h-full"
                  >
                    <Card
                      className={`h-full border ${
                        t.featured
                          ? "border-indigo-200"
                          : "border-slate-100"
                      }`}
                    >
                      <CardContent className="p-8 h-full flex flex-col justify-between">
                        <div>
                          {t.featured && (
                            <div className="w-12 h-12 mb-6 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl">
                              {t.logo}
                            </div>
                          )}

                          <blockquote>
                            <p
                              className={`${
                                t.featured
                                  ? "text-xl font-semibold"
                                  : "text-base"
                              } text-slate-700 leading-relaxed`}
                            >
                              “{t.quote}”
                            </p>
                          </blockquote>
                        </div>

                        <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-100">
                          <Avatar className="size-12">
                            <AvatarImage src={t.avatar} alt={t.name} />
                            <AvatarFallback>
                              {t.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <cite className="not-italic font-bold text-slate-900 block">
                              {t.name}
                            </cite>
                            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                              {t.role}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* CONTROLS */}
          <div className="mt-10 flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => emblaApi?.scrollNext()}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
