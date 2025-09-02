"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Shield, Users, Eye, Lock, Scale, Globe, CheckCircle2, Sparkles, Zap, ArrowRight, Home } from "lucide-react";
import { useState, useEffect } from "react";
import LandingNavbar from "@/components/LandingNavbar";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [readProgress, setReadProgress] = useState<number[]>([]);
  const [orbPositions, setOrbPositions] = useState<Array<{left: number, top: number}>>([]);

  const handleSectionClick = (index: number) => {
    setActiveSection(activeSection === index ? null : index);
    if (!readProgress.includes(index)) {
      setReadProgress([...readProgress, index]);
    }
  };

  const termsData = [
    {
      icon: Users,
      title: "Aceitação dos Termos",
      summary: "Sua concordância com nossos termos",
      content: "Ao criar uma conta no Red Shark, você automaticamente concorda em cumprir e ficar vinculado aos seguintes termos e condições. Se você não concorda com qualquer parte destes termos, recomendamos que não utilize nosso serviço. Estes termos constituem um acordo legal entre você e o Red Shark.",
      color: "blue",
      bgGradient: "from-blue-500/10 to-blue-600/5"
    },
    {
      icon: Globe,
      title: "Sobre o Red Shark",
      summary: "O que é nossa plataforma",
      content: "O Red Shark é uma plataforma de rede social inovadora que conecta pessoas ao redor do mundo. Oferecemos ferramentas para compartilhar conteúdo, conectar-se com amigos, descobrir novos interesses e participar de comunidades vibrantes. Nos reservamos o direito de modificar, suspender ou descontinuar qualquer aspecto do serviço a qualquer momento.",
      color: "purple",
      bgGradient: "from-purple-500/10 to-purple-600/5"
    },
    {
      icon: Shield,
      title: "Responsabilidades da Conta",
      summary: "Suas obrigações como usuário",
      content: "Você é totalmente responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades que ocorrem em sua conta. Deve notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta. É sua responsabilidade garantir que todas as informações fornecidas sejam precisas e atualizadas.",
      color: "green",
      bgGradient: "from-green-500/10 to-green-600/5"
    },
    {
      icon: Eye,
      title: "Conteúdo e Propriedade",
      summary: "Direitos sobre o que você compartilha",
      content: "Você mantém todos os direitos de propriedade sobre o conteúdo que publica no Red Shark. Ao postar conteúdo, você nos concede uma licença mundial, não exclusiva e livre de royalties para usar, modificar, executar publicamente, exibir e distribuir tal conteúdo em conexão com nosso serviço. Esta licença termina quando você remove o conteúdo ou encerra sua conta.",
      color: "indigo",
      bgGradient: "from-indigo-500/10 to-indigo-600/5"
    },
    {
      icon: Lock,
      title: "Conduta e Comportamento",
      summary: "Regras de comportamento na plataforma",
      content: "Você concorda em usar o Red Shark de maneira responsável e respeitosa. É proibido: assédio, bullying, spam, violação de direitos autorais, compartilhamento de conteúdo ilegal, hate speech, ou qualquer atividade que possa prejudicar outros usuários ou a integridade da plataforma. Violações podem resultar em suspensão ou banimento permanente.",
      color: "red",
      bgGradient: "from-red-500/10 to-red-600/5"
    },
    {
      icon: Scale,
      title: "Privacidade e Proteção",
      summary: "Como protegemos seus dados",
      content: "Sua privacidade é fundamental para nós. Coletamos, usamos e protegemos suas informações pessoais de acordo com nossa Política de Privacidade, que está incorporada a estes termos por referência. Utilizamos criptografia avançada e medidas de segurança robustas para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição.",
      color: "teal",
      bgGradient: "from-teal-500/10 to-teal-600/5"
    },
    {
      icon: Zap,
      title: "Modificações dos Termos",
      summary: "Como atualizamos estes termos",
      content: "Reservamos o direito de modificar estes termos a qualquer momento. Quando fizermos alterações significativas, notificaremos você através da plataforma, por email ou outros meios apropriados. As mudanças entrarão em vigor 30 dias após a notificação. O uso continuado do serviço após as mudanças constituirá sua aceitação dos novos termos.",
      color: "yellow",
      bgGradient: "from-yellow-500/10 to-yellow-600/5"
    },
    {
      icon: ArrowRight,
      title: "Rescisão e Encerramento",
      summary: "Como contas podem ser encerradas",
      content: "Você pode encerrar sua conta a qualquer momento através das configurações. Podemos suspender ou encerrar sua conta imediatamente, sem aviso prévio, se você violar estes termos ou por qualquer outro motivo que consideremos apropriado. Após o encerramento, você não terá mais acesso ao seu conteúdo, e reservamos o direito de deletar todos os dados associados à sua conta.",
      color: "orange",
      bgGradient: "from-orange-500/10 to-orange-600/5"
    }
  ];

  const progressPercentage = (readProgress.length / termsData.length) * 100;

  useEffect(() => {
    // Generate orb positions only on client side to avoid hydration mismatch
    const positions = Array.from({ length: 8 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100
    }));
    setOrbPositions(positions);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Floating orbs */}
        {orbPositions.map((position, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -100, 50, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 15 + (i * 2), // Use index instead of Math.random()
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8 // Use index instead of Math.random()
            }}
            className={`absolute w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl`}
            style={{
              left: `${position.left}%`,
              top: `${position.top}%`
            }}
          />
        ))}
      </div>

      <LandingNavbar 
        showProgress={{
          current: readProgress.length,
          total: termsData.length
        }}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="relative inline-block mb-8"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25 mb-6">
                <Scale className="w-12 h-12 text-white" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-3xl blur-xl"
                />
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-black mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                Termos
              </span>{" "}
              de Uso
            </motion.h1>
            
            <motion.p
              className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Explore nossos termos de forma interativa. Clique em cada seção para descobrir 
              <motion.span
                animate={{ color: ["#cbd5e1", "#3b82f6", "#8b5cf6", "#cbd5e1"] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="font-semibold mx-1"
              >
                como protegemos você
              </motion.span>
              e sua experiência no Red Shark.
            </motion.p>

            <motion.div
              className="flex items-center justify-center space-x-2 text-sm text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Última atualização: Janeiro de 2025</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Terms Sections */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6">
            {termsData.map((term, index) => {
              const IconComponent = term.icon;
              const isActive = activeSection === index;
              const isRead = readProgress.includes(index);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`
                      relative overflow-hidden rounded-3xl border cursor-pointer transition-all duration-500
                      ${isActive 
                        ? `border-${term.color}-500/50 bg-gradient-to-br ${term.bgGradient} backdrop-blur-sm` 
                        : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50 hover:bg-slate-800/50'
                      }
                    `}
                    onClick={() => handleSectionClick(index)}
                  >
                    {/* Glow effect for active sections */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`absolute inset-0 bg-gradient-to-r from-${term.color}-500/10 via-transparent to-${term.color}-600/10`}
                        />
                      )}
                    </AnimatePresence>

                    <div className="relative p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <motion.div
                            animate={isActive ? { rotate: 360, scale: 1.1 } : {}}
                            transition={{ duration: 0.6 }}
                            className={`
                              w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
                              ${isActive 
                                ? `bg-gradient-to-br from-${term.color}-500 to-${term.color}-600 shadow-lg shadow-${term.color}-500/25` 
                                : 'bg-slate-700/50 group-hover:bg-slate-600/50'
                              }
                            `}
                          >
                            <IconComponent 
                              className={`w-7 h-7 transition-colors duration-300 ${
                                isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                              }`} 
                            />
                          </motion.div>

                          <div className="flex-1">
                            <h3 className={`text-xl font-bold transition-colors duration-300 ${
                              isActive ? `text-${term.color}-400` : 'text-white'
                            }`}>
                              {term.title}
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">{term.summary}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {isRead && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center space-x-1 text-green-400"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-xs">Lido</span>
                            </motion.div>
                          )}
                          
                          <motion.div
                            animate={{ rotate: isActive ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className={`p-2 rounded-xl transition-colors duration-300 ${
                              isActive 
                                ? `bg-${term.color}-500/20 text-${term.color}-400` 
                                : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50'
                            }`}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -20 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="mt-6 pt-6 border-t border-slate-700/30"
                          >
                            <div className={`p-6 rounded-2xl bg-gradient-to-br ${term.bgGradient} border border-${term.color}-500/20`}>
                              <p className="text-slate-300 leading-relaxed text-lg">
                                {term.content}
                              </p>
                              
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-4 flex items-center space-x-2 text-sm"
                              >
                                <div className={`w-2 h-2 rounded-full bg-${term.color}-400`} />
                                <span className="text-slate-400">
                                  Seção {index + 1} de {termsData.length}
                                </span>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Completion Message */}
          <AnimatePresence>
            {progressPercentage === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="mt-12 text-center"
              >
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-3xl p-8 backdrop-blur-sm">
                  <motion.div
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25"
                  >
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-green-400 mb-2">
                    Parabéns! 🎉
                  </h3>
                  <p className="text-slate-300 mb-6">
                    Você leu todos os nossos termos. Agora está pronto para aproveitar 
                    ao máximo sua experiência no Red Shark!
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-blue-500/25"
                    >
                      <Home className="w-5 h-5" />
                      <span>Começar no Red Shark</span>
                      <Sparkles className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}