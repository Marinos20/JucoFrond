import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Loader2, AlertCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { api } from "../../services/api";

/* -----------------------------
DOT MATRIX BACKGROUND
----------------------------- */

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
          uniform float u_dot_size;
          uniform float u_total_size;
          uniform int u_reverse;
          varying vec2 vUv;

          float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
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

            gl_FragColor = vec4(1.0,1.0,1.0,opacity);
          }
        `}
        uniforms={uniforms}
      />
    </mesh>
  );
};

/* -----------------------------
LOGIN MODAL
----------------------------- */

export const LoginModal = ({ open, onClose, onLoginSuccess }) => {

  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) return;

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

          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));

          if (onLoginSuccess) {
            onLoginSuccess(response.user);
          }

          if (onClose) {
            onClose();
          }

        }, 1200);

      } else {
        setError(response.message || "Erreur inconnue.");
      }

    } catch (err) {

      console.error("AUTH ERROR:", err);

      setError(err?.message || "Erreur serveur");

    } finally {
      setIsLoading(false);
    }
  };

  return (

    <AnimatePresence>

      {open && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-lg"
        >

          {/* BACKGROUND */}
          <div className="absolute inset-0">
            <Canvas camera={{ position: [0,0,1] }}>
              <DotMatrix reverse={isSuccess} />
            </Canvas>
          </div>

          {/* MODAL */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative z-10 w-full max-w-sm px-8 py-10 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl"
          >

            <div className="text-center mb-8">

              <h2 className="text-3xl font-bold text-white">
                {isRegister ? "Créer un compte" : "Connexion"}
              </h2>

              <p className="text-white/40 text-sm mt-2">
                {isRegister ? "Créer un compte parent" : "Accéder à votre espace"}
              </p>

            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {isRegister && (
                <>
                  <input
                    placeholder="Prénom"
                    value={firstName}
                    onChange={(e)=>setFirstName(e.target.value)}
                    className="w-full bg-white/10 rounded-full px-5 py-3 text-white outline-none"
                  />

                  <input
                    placeholder="Nom"
                    value={lastName}
                    onChange={(e)=>setLastName(e.target.value)}
                    className="w-full bg-white/10 rounded-full px-5 py-3 text-white outline-none"
                  />

                  <input
                    placeholder="Téléphone"
                    value={phone}
                    onChange={(e)=>setPhone(e.target.value)}
                    className="w-full bg-white/10 rounded-full px-5 py-3 text-white outline-none"
                  />
                </>
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full bg-white/10 rounded-full px-5 py-3 text-white outline-none"
              />

              <div className="relative">

                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="w-full bg-white/10 rounded-full px-5 py-3 pr-12 text-white outline-none"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-1 top-1 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black"
                >
                  {isLoading
                    ? <Loader2 className="animate-spin" size={18}/>
                    : <ArrowRight size={18}/>
                  }
                </button>

              </div>

            </form>

            <div className="mt-6 text-center text-sm text-white/50">

              <button
                onClick={()=>setIsRegister(!isRegister)}
                className="hover:text-white"
              >
                {isRegister
                  ? "J'ai déjà un compte"
                  : "Créer un compte"}
              </button>

            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              ✕
            </button>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );
};