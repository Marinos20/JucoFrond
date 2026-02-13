// 📌 PublicOffersSection.jsx
import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

export const PublicOffersSection = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.offers.getPublished(); // ⚠️ route publique
        setOffers(res?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold mb-10">
          Offres ouvertes
        </h2>

        {offers.length === 0 ? (
          <p>Aucune offre disponible actuellement.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="p-6 bg-white rounded-3xl shadow"
              >
                <h3 className="text-xl font-bold">
                  {offer.title}
                </h3>

                <p className="text-slate-600 mt-2">
                  {offer.description}
                </p>

                <button
                  className="mt-4 bg-slate-900 text-white px-6 py-3 rounded-2xl"
                >
                  Soumettre un projet
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
