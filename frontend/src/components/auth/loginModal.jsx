import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Loader2, AlertCircle, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { api } from "../../services/api";

// --- COMPOSANT EFFET DE FOND (DOTS) ---
const DotMatrix = ({ reverse = false }) => {
  const { size } = useThree();
  const ref = useRef();

  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(size.width * 2, size.height * 2) },
    u_dot_size: { value: 2.5 },
    u_total_size: { value: 20.0 },
    u_reverse: { value: reverse ? 1 : 0 }
  }), [size, reverse]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.uniforms.u_time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        transparent
        blending={THREE.AdditiveBlending}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float u_time;
          uniform vec2 u_resolution;
          uniform float u_dot_size;
          uniform float u_total_size;
          uniform int u_reverse;
          varying vec2 vUv;

          float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
          }

          void main() {
            vec2 st = gl_FragCoord.xy;
            vec2 grid = floor(st / u_total_size);
            vec2 ipos = fract(st / u_total_size);

            float r = random(grid);
            float pulse = 0.5 + 0.5 * sin(u_time * 2.0 + r * 10.0);
            
            float dist = distance(ipos, vec2(0.5));
            float dot = 1.0 - step(u_dot_size / u_total_size, dist);
            float opacity = dot * pulse * 0.25;
            float radial = 1.0 - distance(vUv, vec2(0.5)) * 1.5;
            opacity *= clamp(radial, 0.0, 1.0);
            if(u_reverse == 1) opacity *= (1.0 - clamp(u_time * 0.5, 0.0, 1.0));
            gl_FragColor = vec4(1.0, 1.0, 1.0, opacity);
          }
        `}
        uniforms={uniforms}
      />
    </mesh>
  );
};

// --- LOGIN + REGISTER ---
export const LoginModal = ({ onBack, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegister && (!firstName || !lastName))) return;

    setIsLoading(true);
    setError(null);

    try {
      let response;

      if (isRegister) {
        response = await api.auth.registerParent({
          email: email.trim(),
          password: password.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim()
        });
      } else {
        response = await api.auth.login({
          email: email.trim(),
          password: password.trim()
        });
      }

      if (response.success) {
        setIsSuccess(true);
        setTimeout(() => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          onLoginSuccess(response.user);
        }, 1500);
      } else {
        setError(response.message || "Une erreur est survenue.");
      }

    } catch (err) {
      console.error("AUTH ERROR :", err);

      // ✅ Message backend prioritaire
      if (err?.message) {
        setError(err.message);
      } else if (err?.success === false && err?.message) {
        setError(err.message);
      } else {
        setError("Erreur serveur. Veuillez réessayer.");
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center justify-center overflow-hidden selection:bg-white selection:text-black font-sans">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <DotMatrix reverse={isSuccess} />
        </Canvas>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-sm px-8">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key={isRegister ? "register" : "login"}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-10"
            >
              {/* Logo & Header */}
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl">
                  S
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight text-indigo-600 leading-tight">
                    {isRegister ? "Créer un compte" : "Bienvenue"}
                  </h1>
                  <p className="text-white/50 text-lg font-light tracking-tight">
                    {isRegister ? "Remplissez le formulaire pour créer votre compte" : "Identifiez-vous pour continuer"}
                  </p>
                </div>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold"
                  >
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}

                <div className="space-y-3">
                  {isRegister && (
                    <>
                      <input
                        type="text"
                        required
                        placeholder="Prénom"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all text-sm placeholder:text-white/20"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Nom"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all text-sm placeholder:text-white/20"
                      />
                      <input
                        type="tel"
                        placeholder="Téléphone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all text-sm placeholder:text-white/20"
                      />
                    </>
                  )}

                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all text-sm placeholder:text-white/20"
                  />

                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="Mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white outline-none focus:border-white/30 focus:bg-white/10 transition-all text-sm placeholder:text-white/20"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="absolute right-2 top-2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} strokeWidth={3} />}
                    </button>
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="space-y-6 pt-4">
                <p
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-white/30 hover:text-white text-xs font-bold cursor-pointer"
                >
                  {isRegister ? "J'ai déjà un compte" : "Pas de compte ? Créer un compte"}
                </p>

                <button 
                  onClick={onBack}
                  className="text-white/30 hover:text-white text-xs font-bold flex items-center justify-center gap-2 mx-auto"
                >
                  <ArrowLeft size={14} /> Retour à l'accueil
                </button>

                <div className="h-px bg-white/10 w-full" />
                
                <p className="text-[10px] text-white/20 font-medium leading-relaxed max-w-[240px] mx-auto uppercase tracking-widest">
                  Accès sécurisé réservé au personnel administratif autorisé.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              className="flex flex-col items-center space-y-8"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                <ShieldCheck size={48} className="text-black" strokeWidth={2.5} />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white tracking-tighter">Accès autorisé.</h2>
                <p className="text-white/40 font-light">Chargement de votre environnement eurofinancement...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
