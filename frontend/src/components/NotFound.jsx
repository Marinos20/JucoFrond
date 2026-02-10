// src/components/NotFound.jsx
export const NotFound = ({ onBack }) => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center">
    <h1 className="text-5xl font-bold mb-4">404</h1>
    <p className="mb-6 text-slate-600">
      Cette page n’existe pas.
    </p>
    <button
      onClick={onBack}
      className="px-4 py-2 rounded bg-slate-900 text-white"
    >
      Retour à l’accueil
    </button>
  </div>
);
