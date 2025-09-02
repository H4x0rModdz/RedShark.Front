"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import UniverseBackground from "@/components/UniverseBackground";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [footerParticlePositions, setFooterParticlePositions] = useState<Array<{left: number, bottom: number}>>([]);
  const [featureParticlePositions, setFeatureParticlePositions] = useState<Array<{left: number, top: number}>>([]);
  const [typewriterText, setTypewriterText] = useState("");
  const [activeModal, setActiveModal] = useState<number | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/home");
    } else {
      setIsVisible(true);
    }
  }, [status, router]);

  useEffect(() => {
    // Generate particle positions only on client side to avoid hydration mismatch
    const footerParticles = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      bottom: Math.random() * 50
    }));
    const featureParticles = Array.from({ length: 30 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100
    }));
    setFooterParticlePositions(footerParticles);
    setFeatureParticlePositions(featureParticles);
  }, []);

  // Typewriter effect for subtitle
  useEffect(() => {
    const fullText = "Uma rede social inovadora onde você pode compartilhar momentos únicos, conectar com pessoas incríveis e descobrir conteúdos que realmente importam.";
    let currentIndex = 0;
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setTypewriterText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
        
        if (currentIndex >= fullText.length) {
          clearInterval(interval);
        }
      }, 30); // 30ms per character
      
      return () => clearInterval(interval);
    }, 2000); // Start after 2s delay
    
    return () => clearTimeout(timer);
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg font-medium">Carregando Red Shark...</p>
        </div>
      </div>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between md:justify-between items-center py-4">
            {/* Mobile: Centered brand */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex md:hidden justify-center items-center space-x-3 mx-auto"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <span className="text-white font-bold text-lg">RS</span>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-blue-400/20 rounded-xl"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Red Shark
                </h1>
                <p className="text-xs text-slate-400">Conecte-se ao mundo</p>
              </div>
            </motion.div>

            {/* Desktop: Left brand */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-3"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <span className="text-white font-bold text-lg">RS</span>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-blue-400/20 rounded-xl"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Red Shark
                </h1>
                <p className="text-xs text-slate-400">Conecte-se ao mundo</p>
              </div>
            </motion.div>
            
            {/* Desktop: Right buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-4"
            >
              <Link
                href="/login"
                className="text-slate-300 hover:text-white transition-all duration-200 px-4 py-2 rounded-lg hover:bg-slate-800/50"
              >
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-xl transition-all duration-200 font-medium shadow-lg shadow-blue-500/20"
                >
                  Registrar
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        {/* Universe Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-home-bg.mp4" type="video/mp4" />
        </video>
        
        {/* Enhanced overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/40 to-black/50 pointer-events-none" />
        
        {/* Additional dark film overlay */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Animated title */}
            <motion.h1
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 1.2, 
                ease: "easeOut",
                type: "spring",
                stiffness: 100
              }}
              className="text-6xl md:text-8xl font-black mb-8"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="block"
              >
                Conecte-se com o
              </motion.span>
              <motion.span 
                className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, rotateX: -90 }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                mundo
              </motion.span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mb-12 max-w-4xl mx-auto"
            >
              <p 
                className="text-lg md:text-xl text-white leading-relaxed"
                style={{
                  textShadow: '0 3px 12px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,0.7)'
                }}
              >
                  {typewriterText.split('compartilhar momentos únicos').map((part, index) => 
                    index === 0 ? (
                      <span key={index}>
                        {part}
                        {typewriterText.includes('compartilhar momentos únicos') && (
                          <span className="text-blue-300 font-semibold">
                            compartilhar momentos únicos
                          </span>
                        )}
                      </span>
                    ) : (
                      <span key={index}>{part}</span>
                    )
                  )}
                  {typewriterText && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-blue-400 ml-1"
                    >
                      |
                    </motion.span>
                  )}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-14 py-7 rounded-2xl text-2xl font-bold transition-all duration-300 inline-flex items-center space-x-3 shadow-lg shadow-blue-500/25"
                >
                  <span>Começar agora</span>
                  <span>🚀</span>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="bg-white/90 hover:bg-white text-slate-800 hover:text-slate-900 px-12 py-6 rounded-2xl text-xl font-bold transition-all duration-300 inline-flex items-center space-x-3 border border-white/20 shadow-lg shadow-black/20"
                >
                  <span>Já tenho conta</span>
                  <span>✨</span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Decorative floating elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-40 left-20 hidden lg:block"
            >
              <div className="w-20 h-20 bg-blue-500/10 rounded-full border border-blue-400/20 flex items-center justify-center backdrop-blur-sm">
                <motion.span 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="text-3xl"
                >
                  💫
                </motion.span>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 25, 0],
                rotate: [0, -15, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-60 right-24 hidden lg:block"
            >
              <div className="w-16 h-16 bg-purple-500/10 rounded-full border border-purple-400/20 flex items-center justify-center backdrop-blur-sm">
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl"
                >
                  🌟
                </motion.span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-800/30 backdrop-blur-sm relative">
        {/* Background pattern */}
        <div className="absolute inset-0">
          {featureParticlePositions.map((position, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -50, 0],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: (i * 0.4) + 5, // Use index instead of Math.random()
                repeat: Infinity,
                delay: i * 0.2, // Use index instead of Math.random()
                ease: "easeInOut"
              }}
              className="absolute w-px h-px bg-blue-400/20 rounded-full"
              style={{
                left: `${position.left}%`,
                top: `${position.top + 100}%`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-black mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Por que escolher o{" "}
              <motion.span
                className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                Red Shark
              </motion.span>
              ?
            </motion.h2>
            <motion.p 
              className="text-slate-300 text-2xl max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Descubra os recursos que tornam nossa plataforma única e revolucionária
              <span className="block text-lg text-slate-400 mt-3">
                ✨ Clique em cada card para saber mais detalhes
              </span>
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🇧🇷",
                title: "Cultura Brasileira",
                description: "Uma rede social feita no Brasil, por brasileiros. Apoiamos a cultura nacional, valorizamos nossa identidade e conectamos pessoas que compartilham do orgulho de ser brasileiro.",
                color: "from-blue-500/20 to-blue-700/20",
                accentColor: "blue",
                expandedContent: {
                  subtitle: "Desenvolvido com amor pelo Brasil",
                  content: `O Red Shark nasceu da paixão pela nossa cultura e pela necessidade de ter uma rede social que represente verdadeiramente os valores brasileiros.

**Por que isso importa:**
• Desenvolvido por brasileiros que entendem nossa realidade
• Interface e experiência pensadas para o usuário brasileiro
• Apoio direto ao desenvolvimento de tecnologia nacional
• Valorização da diversidade cultural do nosso país
• Comunidade que celebra nossa identidade única

**Nosso compromisso:**
Manter sempre a essência brasileira em cada funcionalidade, respeitando nossa diversidade e promovendo conexões autênticas entre pessoas que compartilham do orgulho de ser brasileiro.`,
                  stats: [
                    { label: "Desenvolvedores BR", value: "100%" },
                    { label: "Código Nacional", value: "🇧🇷" },
                    { label: "Orgulho BR", value: "💚💛" }
                  ]
                }
              },
              {
                icon: "💻",
                title: "Open Source",
                description: "Código fonte 100% aberto e transparente. Você pode visualizar, estudar e até contribuir para o desenvolvimento. Sem segredos, apenas colaboração genuína.",
                color: "from-purple-500/20 to-purple-700/20",
                accentColor: "purple",
                expandedContent: {
                  subtitle: "Transparência total no desenvolvimento",
                  content: `Todo o código do Red Shark está disponível publicamente. Acreditamos que a transparência gera confiança e melhores soluções.

**Vantagens do Open Source:**
• Código auditável por qualquer pessoa
• Contribuições da comunidade melhoram a plataforma
• Transparência total sobre como seus dados são tratados
• Aprendizado compartilhado entre desenvolvedores
• Evolução rápida através da colaboração coletiva

**Como contribuir:**
Você pode reportar bugs, sugerir melhorias, contribuir com código ou simplesmente acompanhar o desenvolvimento. Toda contribuição é bem-vinda!`,
                  stats: [
                    { label: "Repositórios", value: "Públicos" },
                    { label: "Licença", value: "MIT" },
                    { label: "Contribuições", value: "Abertas" }
                  ]
                }
              },
              {
                icon: "🛡️",
                title: "Privacidade Real",
                description: "Foco total na sua segurança e privacidade. Seus dados são seus, não vendemos informações pessoais para terceiros. Diga não à exploração comercial dos seus dados.",
                color: "from-blue-600/20 to-purple-600/20",
                accentColor: "indigo",
                expandedContent: {
                  subtitle: "Seus dados, suas regras",
                  content: `Diferentemente das grandes redes sociais, o Red Shark não explora comercialmente seus dados pessoais. Sua privacidade é inegociável.

**Nossa garantia de privacidade:**
• Nunca vendemos dados pessoais para terceiros
• Não fazemos perfil publicitário dos usuários
• Dados criptografados e armazenados com segurança máxima
• Controle total sobre suas informações pessoais
• Transparência completa sobre uso de dados

**Tecnologias de segurança:**
Utilizamos as mais avançadas tecnologias de criptografia e proteção de dados, garantindo que suas informações estejam sempre seguras e sob seu controle.`,
                  stats: [
                    { label: "Venda de Dados", value: "ZERO" },
                    { label: "Criptografia", value: "Total" },
                    { label: "Seu Controle", value: "100%" }
                  ]
                }
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.2,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                onClick={() => setActiveModal(index)}
                className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 hover:border-${feature.accentColor}-500/40 transition-all duration-300 relative overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-${feature.accentColor}-500/20`}
              >
                {/* Hover glow effect */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  className={`absolute inset-0 bg-gradient-to-r from-${feature.accentColor}-500/5 to-transparent`}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="text-6xl mb-8 relative"
                    animate={{
                      rotate: [0, 10, 0, -5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                  >
                    {feature.icon}
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      className={`absolute inset-0 bg-${feature.accentColor}-400/20 rounded-full blur-xl`}
                    />
                  </motion.div>
                  
                  <motion.h3 
                    className={`text-2xl font-bold mb-4 text-${feature.accentColor}-400`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {feature.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-slate-300 leading-relaxed text-lg"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {feature.description}
                  </motion.p>
                </div>

                {/* Decorative elements */}
                <motion.div
                  className={`absolute -top-4 -right-4 w-24 h-24 bg-${feature.accentColor}-500/5 rounded-full`}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.7
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-center mt-20"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-12 py-6 rounded-2xl text-2xl font-bold transition-all duration-300 shadow-2xl shadow-blue-500/25"
              >
                <span>Junte-se ao Red Shark</span>
                <motion.span
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎯
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Modal */}
          {activeModal !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setActiveModal(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-slate-700/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const features = [
                    {
                      icon: "🇧🇷",
                      title: "Cultura Brasileira",
                      color: "from-blue-500/20 to-blue-700/20",
                      accentColor: "blue",
                      expandedContent: {
                        subtitle: "Desenvolvido com amor pelo Brasil",
                        content: `O Red Shark nasceu da paixão pela nossa cultura e pela necessidade de ter uma rede social que represente verdadeiramente os valores brasileiros.

**Por que isso importa:**
• Desenvolvido por brasileiros que entendem nossa realidade
• Interface e experiência pensadas para o usuário brasileiro
• Apoio direto ao desenvolvimento de tecnologia nacional
• Valorização da diversidade cultural do nosso país
• Comunidade que celebra nossa identidade única

**Nosso compromisso:**
Manter sempre a essência brasileira em cada funcionalidade, respeitando nossa diversidade e promovendo conexões autênticas entre pessoas que compartilham do orgulho de ser brasileiro.`,
                        stats: [
                          { label: "Desenvolvedores BR", value: "100%" },
                          { label: "Código Nacional", value: "🇧🇷" },
                          { label: "Orgulho BR", value: "💚💛" }
                        ]
                      }
                    },
                    {
                      icon: "💻",
                      title: "Open Source",
                      color: "from-purple-500/20 to-purple-700/20",
                      accentColor: "purple",
                      expandedContent: {
                        subtitle: "Transparência total no desenvolvimento",
                        content: `Todo o código do Red Shark está disponível publicamente. Acreditamos que a transparência gera confiança e melhores soluções.

**Vantagens do Open Source:**
• Código auditável por qualquer pessoa
• Contribuições da comunidade melhoram a plataforma
• Transparência total sobre como seus dados são tratados
• Aprendizado compartilhado entre desenvolvedores
• Evolução rápida através da colaboração coletiva

**Como contribuir:**
Você pode reportar bugs, sugerir melhorias, contribuir com código ou simplesmente acompanhar o desenvolvimento. Toda contribuição é bem-vinda!`,
                        stats: [
                          { label: "Repositórios", value: "Públicos" },
                          { label: "Licença", value: "MIT" },
                          { label: "Contribuições", value: "Abertas" }
                        ]
                      }
                    },
                    {
                      icon: "🛡️",
                      title: "Privacidade Real",
                      color: "from-blue-600/20 to-purple-600/20",
                      accentColor: "indigo",
                      expandedContent: {
                        subtitle: "Seus dados, suas regras",
                        content: `Diferentemente das grandes redes sociais, o Red Shark não explora comercialmente seus dados pessoais. Sua privacidade é inegociável.

**Nossa garantia de privacidade:**
• Nunca vendemos dados pessoais para terceiros
• Não fazemos perfil publicitário dos usuários
• Dados criptografados e armazenados com segurança máxima
• Controle total sobre suas informações pessoais
• Transparência completa sobre uso de dados

**Tecnologias de segurança:**
Utilizamos as mais avançadas tecnologias de criptografia e proteção de dados, garantindo que suas informações estejam sempre seguras e sob seu controle.`,
                        stats: [
                          { label: "Venda de Dados", value: "ZERO" },
                          { label: "Criptografia", value: "AES-256" },
                          { label: "Seu Controle", value: "100%" }
                        ]
                      }
                    }
                  ];
                  
                  const feature = features[activeModal];
                  
                  return (
                    <>
                      {/* Close button */}
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setActiveModal(null)}
                        className="absolute top-6 right-6 w-12 h-12 bg-slate-800/80 hover:bg-slate-700/80 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 z-10"
                      >
                        ✕
                      </motion.button>

                      {/* Header */}
                      <div className={`bg-gradient-to-r ${feature.color} p-8 rounded-t-3xl border-b border-slate-700/50`}>
                        <div className="flex items-center space-x-4 mb-4">
                          <motion.div
                            animate={{ 
                              rotate: [0, 10, 0, -10, 0],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="text-6xl"
                          >
                            {feature.icon}
                          </motion.div>
                          <div>
                            <h3 className={`text-3xl font-bold text-${feature.accentColor}-400 mb-2`}>
                              {feature.title}
                            </h3>
                            <p className="text-lg text-slate-300">
                              {feature.expandedContent.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="prose prose-invert prose-lg max-w-none mb-8"
                        >
                          {feature.expandedContent.content.split('\n').map((paragraph, i) => {
                            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                              return (
                                <h4 key={i} className={`text-xl font-bold text-${feature.accentColor}-400 mt-6 mb-3`}>
                                  {paragraph.slice(2, -2)}
                                </h4>
                              );
                            }
                            if (paragraph.startsWith('•')) {
                              return (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * i }}
                                  className="flex items-start space-x-3 mb-2"
                                >
                                  <span className={`text-${feature.accentColor}-400 mt-1`}>•</span>
                                  <span className="text-slate-300">{paragraph.slice(2)}</span>
                                </motion.div>
                              );
                            }
                            if (paragraph.trim()) {
                              return (
                                <p key={i} className="text-slate-300 leading-relaxed mb-4">
                                  {paragraph}
                                </p>
                              );
                            }
                            return null;
                          })}
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="grid grid-cols-3 gap-4"
                        >
                          {feature.expandedContent.stats.map((stat, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + i * 0.1 }}
                              whileHover={{ scale: 1.05 }}
                              className={`bg-gradient-to-br from-${feature.accentColor}-500/10 to-${feature.accentColor}-600/5 p-6 rounded-2xl border border-${feature.accentColor}-500/20 text-center`}
                            >
                              <div className={`text-2xl font-black text-${feature.accentColor}-400 mb-2`}>
                                {stat.value}
                              </div>
                              <div className="text-slate-400 text-sm font-medium">
                                {stat.label}
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative bg-slate-900 border-t border-slate-800 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"
            style={{
              backgroundSize: "400% 400%"
            }}
          />
          
          {/* Floating particles */}
          {footerParticlePositions.map((position, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 0.3, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 8 + (i * 0.5), // Use index instead of Math.random()
                repeat: Infinity,
                delay: i * 0.6, // Use index instead of Math.random()
                ease: "easeInOut"
              }}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
              style={{
                left: `${position.left}%`,
                bottom: `${position.bottom}%`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Main Footer Content */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="flex items-center space-x-4 mb-6">
                <motion.div
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="relative"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                    <span className="text-white font-black text-2xl">RS</span>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-2xl blur-xl"
                  />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Red Shark
                  </h2>
                  <p className="text-slate-400 text-lg">Conectando pessoas, criando conexões</p>
                </div>
              </div>
              
              <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-md">
                Uma rede social inovadora que coloca você no centro de conexões autênticas. 
                Junte-se a milhões de pessoas descobrindo e compartilhando momentos únicos.
              </p>

              {/* Social Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: "Usuários Ativos", value: "10M+", color: "blue" },
                  { label: "Posts Diários", value: "2.5M+", color: "purple" },
                  { label: "Países", value: "195+", color: "pink" }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`text-center p-4 rounded-2xl bg-gradient-to-br from-${stat.color}-500/10 to-${stat.color}-600/5 border border-${stat.color}-500/20 backdrop-blur-sm`}
                  >
                    <div className={`text-2xl font-black text-${stat.color}-400 mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-slate-400 text-sm font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <motion.span 
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🚀
                </motion.span>
                <span>Explorar</span>
              </h3>
              
              <div className="space-y-4">
                {[
                  { name: "Como Funciona", href: "/faq", icon: "❓" },
                  { name: "Recursos", href: "/faq", icon: "✨" },
                  { name: "Segurança", href: "/faq", icon: "🛡️" },
                  { name: "Suporte", href: "/faq", icon: "💬" }
                ].map((link, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center space-x-3 text-slate-400 hover:text-white transition-all duration-200 group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                        {link.icon}
                      </span>
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Legal & Contact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📋
                </motion.span>
                <span>Legal</span>
              </h3>
              
              <div className="space-y-4">
                {[
                  { name: "Termos de Uso", href: "/terms", icon: "⚖️" },
                  { name: "Política de Privacidade", href: "/terms", icon: "🔒" },
                  { name: "Diretrizes", href: "/faq", icon: "📋" },
                  { name: "Contato", href: "/faq", icon: "📧" }
                ].map((link, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center space-x-3 text-slate-400 hover:text-white transition-all duration-200 group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                        {link.icon}
                      </span>
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Newsletter Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 p-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl border border-blue-500/20 backdrop-blur-sm"
          >
            <div className="text-center max-w-2xl mx-auto">
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-block mb-4"
              >
                <span className="text-4xl">🌟</span>
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Seja o primeiro a saber das novidades!
              </h3>
              <p className="text-slate-300 mb-6">
                Receba atualizações sobre novos recursos, dicas e o que há de melhor no Red Shark.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="flex-1 px-6 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:border-blue-500/50 focus:outline-none transition-all duration-200"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-blue-500/25"
                >
                  Inscrever-se
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center"
          >
            <div className="text-slate-400 text-center md:text-left mb-4 md:mb-0">
              <p className="flex items-center justify-center md:justify-start space-x-2">
                <span>© 2025 Red Shark. Todos os direitos reservados.</span>
                <motion.span 
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </p>
              <p className="text-sm mt-1">
                {'Feito com <3 para conectar o mundo'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
              <span className="text-slate-400">Servidores operando normalmente</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}