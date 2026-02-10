
import React from 'react';
import { Users, CheckCircle2, Lock } from 'lucide-react';
import { Card, CardContent } from './ui/card.jsx';

export const Features = () => {
    return (
        <section id="features" className="bg-slate-50/50 py-24 md:py-32 overflow-hidden">
            <div className="mx-auto max-w-6xl px-6">
                
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">
                        Une plateforme, <br /> 
                        <span className="text-indigo-600">conforme aux meilleures pratiques.</span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                        L'excellence technologique au service du financement
                    </p>
                </div>

                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-6">
                        
                        {/* CARTE 1: ADAPTATION */}
                        <Card className="col-span-full lg:col-span-2 bg-indigo-600 text-white border-none shadow-indigo-200">
                            <CardContent className="flex flex-col justify-center h-full text-center py-12">
                                <div className="relative flex h-24 w-full items-center justify-center mb-8">
                                    <svg
                                        className="text-white/20 absolute inset-0 size-full"
                                        viewBox="0 0 254 104"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span className="mx-auto block w-fit text-6xl font-black tracking-tighter">100%</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Europenne</h3>
                                <p className="text-indigo-100 text-sm font-medium">Une infrastructure automatisée, entièrement pensée pour les entreprises.</p>
                            </CardContent>
                        </Card>

                        {/* CARTE 2: SECURITE */}
                        <Card className="col-span-full sm:col-span-3 lg:col-span-2">
                            <CardContent className="pt-10 flex flex-col items-center text-center">
                                <div className="relative mx-auto flex aspect-square size-32 rounded-full border border-slate-100 before:absolute before:-inset-2 before:rounded-full before:border before:border-slate-50">
                                    <div className="m-auto w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                        <Lock size={32} />
                                    </div>
                                </div>
                                <div className="mt-8 space-y-3">
                                    <h3 className="text-xl font-bold text-slate-900">Sûr par défaut</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">Toutes les transactions et données des utilisateurs sont cryptées et protégées </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CARTE 3: PERFORMANCE (CHART) */}
                        <Card className="col-span-full sm:col-span-3 lg:col-span-2">
                            <CardContent className="pt-10">
                                <div className="relative h-40 flex items-end justify-center px-4">
                                    <svg
                                        className="text-indigo-600 w-full h-full"
                                        viewBox="0 0 386 123"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M3 123C3 123 14.3298 94.153 35.1282 88.0957C55.9266 82.0384 65.9333 80.5508 65.9333 80.5508C65.9333 80.5508 80.699 80.5508 92.1777 80.5508C103.656 80.5508 100.887 63.5348 109.06 63.5348C117.233 63.5348 117.217 91.9728 124.78 91.9728C132.343 91.9728 142.264 78.03 153.831 80.5508C165.398 83.0716 186.825 91.9728 193.761 91.9728C200.697 91.9728 206.296 63.5348 214.07 63.5348C221.844 63.5348 238.653 93.7771 244.234 91.9728C249.814 90.1684 258.8 60 266.19 60C272.075 60 284.1 88.057 286.678 88.0957C294.762 88.2171 300.192 72.9284 305.423 72.9284C312.323 72.9284 323.377 65.2437 335.553 63.5348C347.729 61.8259 348.218 82.07 363.639 80.5508C367.875 80.1335 372.949 82.2017 376.437 87.1008C379.446 91.3274 381.054 97.4325 382.521 104.647C383.479 109.364 382.521 123 382.521 123"
                                            fill="url(#paint0_linear_features)"
                                        />
                                        <path
                                            className="text-indigo-600"
                                            d="M3 121.077C3 121.077 15.3041 93.6691 36.0195 87.756C56.7349 81.8429 66.6632 80.9723 66.6632 80.9723C66.6632 80.9723 80.0327 80.9723 91.4656 80.9723C102.898 80.9723 100.415 64.2824 108.556 64.2824C116.696 64.2824 117.693 92.1332 125.226 92.1332C132.759 92.1332 142.07 78.5115 153.591 80.9723C165.113 83.433 186.092 92.1332 193 92.1332C199.908 92.1332 205.274 64.2824 213.017 64.2824C220.76 64.2824 237.832 93.8946 243.39 92.1332C248.948 90.3718 257.923 60.5 265.284 60.5C271.145 60.5 283.204 87.7182 285.772 87.756C293.823 87.8746 299.2 73.0802 304.411 73.0802C311.283 73.0802 321.425 65.9506 333.552 64.2824C345.68 62.6141 346.91 82.4553 362.27 80.9723C377.629 79.4892 383 106.605 383 106.605"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        />
                                        <defs>
                                            <linearGradient id="paint0_linear_features" x1="3" y1="60" x2="3" y2="123" gradientUnits="userSpaceOnUse">
                                                <stop offset="0" stopColor="#6366f1" stopOpacity="0.2" />
                                                <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="mt-8 text-center space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900">Gestion ultra-rapide</h3>
                                    <p className="text-slate-500 text-sm">Optimisez votre temps administratif et bénéficiez d’un accompagnement structuré pour vos projets.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CARTE 4: ZERO PAPIER (WINDOW) */}
                        <Card className="col-span-full lg:col-span-3">
                            <CardContent className="grid sm:grid-cols-2 gap-8 items-center pt-10">
                                <div className="space-y-6">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Communication et mécanismes de suivi renforcés</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">La plateforme permet un suivi structuré des projets financés, une communication fluide entre les bénéficiaires et les partenaires, et une meilleure traçabilité des actions mises en œuvre.</p>
                                    </div>
                                </div>
                                <div className="relative -mb-10 -mr-10 bg-slate-50 border border-slate-200 rounded-tl-3xl p-4 shadow-inner">
                                     <div className="flex gap-1.5 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                                     </div>
                                     <div className="space-y-3">
                                        <div className="h-4 bg-white rounded-full w-3/4" />
                                        <div className="h-4 bg-white rounded-full w-1/2" />
                                        <div className="h-20 bg-white rounded-2xl w-full" />
                                     </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* CARTE 5: AVATARS */}
                        <Card className="col-span-full lg:col-span-3">
                            <CardContent className="grid sm:grid-cols-2 gap-8 items-center pt-10">
                                <div className="space-y-6">
                                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                        <Users size={24} />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Paiement et suivi parental</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">Un dispositif numérique sécurisé permettant le suivi des bénéficiaires et la traçabilité des contributions financières, <span className='font-bold'>y compris pour les paiements réalisés depuis l’étranger, avec émission systématique de preuves de paiement</span>.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 justify-center items-center py-6">
                                    <div className="flex items-center gap-3 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm w-fit -rotate-2">
                                        <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/100?u=a" alt="User" />
                                        <span className="text-xs font-bold text-slate-700 pr-4">Directrice</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-indigo-600 p-2 rounded-2xl shadow-xl w-fit translate-x-4 rotate-3">
                                        <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/100?u=b" alt="User" />
                                        <span className="text-xs font-bold text-white pr-4">Aide social</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm w-fit -translate-x-4 -rotate-1">
                                        <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/100?u=c" alt="User" />
                                        <span className="text-xs font-bold text-slate-700 pr-4">Comptable</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </section>
    );
};
