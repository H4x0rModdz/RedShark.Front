"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  MessageCircle, 
  Shield, 
  User, 
  Settings, 
  Smartphone, 
  Heart,
  Lightbulb,
  Star,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Zap,
  Globe,
  Lock,
  Users,
  HelpCircle,
  Mail,
  Phone,
  Send
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import LandingNavbar from "@/components/LandingNavbar";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showContact, setShowContact] = useState(false);
  const [orbPositions, setOrbPositions] = useState<Array<{left: number, top: number}>>([]);

  const categories = [
    { id: "all", name: "Todas", icon: Globe, color: "blue" },
    { id: "account", name: "Conta", icon: User, color: "green" },
    { id: "security", name: "Segurança", icon: Shield, color: "red" },
    { id: "features", name: "Recursos", icon: Sparkles, color: "purple" },
    { id: "mobile", name: "Mobile", icon: Smartphone, color: "indigo" },
    { id: "support", name: "Suporte", icon: HelpCircle, color: "teal" },
  ];

  const faqData = [
    {
      id: 1,
      category: "account",
      question: "Como criar uma conta no Red Shark?",
      answer: "Para criar uma conta no Red Shark, clique no botão 'Registrar' na página inicial. Você precisará fornecer informações básicas como nome, email e senha. Após preencher o formulário, você receberá um email de confirmação para ativar sua conta. O processo é simples, seguro e leva apenas alguns minutos.",
      tags: ["registro", "conta", "email", "confirmação"],
      popularity: 95
    },
    {
      id: 2,
      category: "account",
      question: "Como alterar minha senha?",
      answer: "Para alterar sua senha, vá para Configurações > Segurança > Alterar Senha. Você precisará inserir sua senha atual e depois a nova senha duas vezes para confirmação. Recomendamos usar senhas fortes com pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.",
      tags: ["senha", "segurança", "configurações"],
      popularity: 88
    },
    {
      id: 3,
      category: "account",
      question: "Posso excluir minha conta?",
      answer: "Sim, você pode excluir sua conta a qualquer momento. Vá para Configurações > Conta > Excluir Conta. ATENÇÃO: Esta ação é irreversível! Todos os seus dados, posts, conexões e histórico serão permanentemente removidos de nossos servidores. Recomendamos fazer um backup de informações importantes antes de prosseguir.",
      tags: ["excluir", "deletar", "conta", "irreversível"],
      popularity: 76
    },
    {
      id: 4,
      category: "security",
      question: "Como reportar conteúdo inadequado?",
      answer: "Para reportar conteúdo inadequado, clique nos três pontos (⋯) ao lado do post e selecione 'Reportar'. Você pode escolher a categoria da violação (spam, assédio, conteúdo inadequado, etc.) e adicionar comentários adicionais. Nossa equipe de moderação revisa todos os reports em até 24 horas e toma as medidas apropriadas.",
      tags: ["reportar", "denunciar", "moderação", "conteúdo"],
      popularity: 82
    },
    {
      id: 5,
      category: "security",
      question: "Meus dados estão seguros no Red Shark?",
      answer: "Absolutamente! Levamos sua privacidade e segurança muito a sério. Utilizamos criptografia SSL/TLS para proteger dados em trânsito, criptografia AES-256 para dados armazenados, autenticação de dois fatores, e seguimos as melhores práticas de segurança da indústria. Nunca vendemos seus dados pessoais para terceiros.",
      tags: ["segurança", "privacidade", "criptografia", "dados"],
      popularity: 91
    },
    {
      id: 6,
      category: "features",
      question: "Como funciona o sistema de privacidade?",
      answer: "Você tem controle total sobre quem pode ver seu conteúdo. Nas configurações de privacidade, você pode definir suas postagens como: Públicas (todos podem ver), Amigos (apenas pessoas que você segue), ou Privadas (apenas você). Também pode controlar quem pode enviar mensagens, ver sua lista de seguidores, e muito mais.",
      tags: ["privacidade", "postagens", "configurações", "controle"],
      popularity: 79
    },
    {
      id: 7,
      category: "features",
      question: "Como funciona o sistema de curtidas e comentários?",
      answer: "Você pode curtir posts clicando no ícone de coração ❤️ e comentar clicando no ícone de comentário 💬. Os comentários podem ser respondidos, criando threads de conversação. Você pode ver quem curtiu seus posts e receber notificações sobre interações. Também é possível descurtir e editar comentários dentro de 5 minutos após postá-los.",
      tags: ["curtidas", "comentários", "interações", "notificações"],
      popularity: 85
    },
    {
      id: 8,
      category: "mobile",
      question: "Existe um app móvel do Red Shark?",
      answer: "Atualmente, o Red Shark funciona perfeitamente através do navegador em dispositivos móveis - nossa interface é totalmente responsiva e otimizada para smartphones e tablets. Um aplicativo nativo está em desenvolvimento e será lançado em 2025 para iOS e Android, com recursos exclusivos como notificações push e modo offline.",
      tags: ["app", "móvel", "celular", "responsivo"],
      popularity: 87
    },
    {
      id: 9,
      category: "features",
      question: "Posso compartilhar fotos e vídeos?",
      answer: "Sim! Você pode compartilhar múltiplas fotos (até 10 por post) e vídeos (até 5 minutos de duração). Suportamos formatos JPG, PNG, GIF para imagens e MP4, MOV para vídeos. Temos filtros, ferramentas de edição básica e compressão automática para otimizar o carregamento. O upload é rápido e seguro.",
      tags: ["fotos", "vídeos", "mídia", "upload"],
      popularity: 83
    },
    {
      id: 10,
      category: "support",
      question: "Como entrar em contato com o suporte?",
      answer: "Você pode entrar em contato conosco de várias formas: através do chat ao vivo no canto inferior direito (disponível 24/7), enviando um email para suporte@redshark.com, ou usando o formulário de contato nas configurações. Para problemas urgentes, temos suporte prioritário via telefone para usuários verificados.",
      tags: ["suporte", "contato", "ajuda", "chat"],
      popularity: 77
    },
    {
      id: 11,
      category: "account",
      question: "Como verificar minha conta?",
      answer: "A verificação da conta adiciona um selo azul ✓ ao seu perfil, indicando autenticidade. Para solicitar verificação, vá para Configurações > Conta > Solicitar Verificação. Você precisará fornecer documentos de identificação e informações sobre por que deve ser verificado (figura pública, empresa, criador de conteúdo, etc.).",
      tags: ["verificação", "selo", "autenticidade", "identificação"],
      popularity: 71
    },
    {
      id: 12,
      category: "features",
      question: "Posso agendar publicações?",
      answer: "Sim! Ao criar um post, clique no ícone de relógio 🕒 para acessar o agendador. Você pode escolher data e hora específicas para publicação automática. É possível agendar até 50 posts por vez e editar/cancelar posts agendados antes da publicação. Ideal para manter engajamento constante mesmo quando offline.",
      tags: ["agendar", "posts", "publicação", "automático"],
      popularity: 68
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFAQs = useMemo(() => {
    let filtered = faqData;
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Sort by popularity
    return filtered.sort((a, b) => b.popularity - a.popularity);
  }, [selectedCategory, searchQuery]);

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return "text-green-400";
    if (popularity >= 80) return "text-blue-400";
    if (popularity >= 70) return "text-yellow-400";
    return "text-slate-400";
  };

  const getPopularityIcon = (popularity: number) => {
    if (popularity >= 90) return "🔥";
    if (popularity >= 80) return "⭐";
    if (popularity >= 70) return "👍";
    return "📝";
  };

  useEffect(() => {
    // Generate orb positions only on client side to avoid hydration mismatch
    const positions = Array.from({ length: 12 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100
    }));
    setOrbPositions(positions);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Dynamic background orbs */}
        {orbPositions.map((position, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 200, -100, 0],
              y: [0, -150, 100, 0],
              scale: [0.8, 1.2, 0.9, 0.8],
              rotate: [0, 180, 360, 0]
            }}
            transition={{
              duration: 20 + (i * 2.5), // Use index instead of Math.random()
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.2 // Use index instead of Math.random()
            }}
            className="absolute w-40 h-40 bg-gradient-to-br from-blue-500/3 to-purple-500/3 rounded-full blur-3xl"
            style={{
              left: `${position.left}%`,
              top: `${position.top}%`
            }}
          />
        ))}
      </div>

      <LandingNavbar 
        leftContent={
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -5 }}
                className="p-2 bg-slate-800/50 rounded-xl border border-slate-700/50 group-hover:border-blue-500/50 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
              </motion.div>
              <span className="text-slate-300 group-hover:text-white transition-colors">Início</span>
            </Link>
            
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 text-sm text-slate-400"
              >
                <Search className="w-4 h-4" />
                <span>{filteredFAQs.length} resultado(s) encontrado(s)</span>
              </motion.div>
            )}
          </div>
        }
        rightContent={
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowContact(!showContact)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-green-500/50 transition-all duration-200 group"
          >
            <Mail className="w-4 h-4 text-slate-400 group-hover:text-green-400" />
            <span className="text-slate-300 group-hover:text-white text-sm">Contato</span>
          </motion.button>
        }
      />

      {/* Hero Section */}
      <section className="pt-32 pb-12 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div 
              className="relative inline-block mb-8"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0] 
              }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25 mb-6">
                <HelpCircle className="w-12 h-12 text-white" />
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
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
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Central
              </span>{" "}
              de Ajuda
            </motion.h1>
            
            <motion.p
              className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Encontre respostas instantâneas para suas dúvidas sobre o Red Shark. 
              <motion.span
                animate={{ color: ["#cbd5e1", "#3b82f6", "#8b5cf6", "#ec4899", "#cbd5e1"] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="font-semibold mx-1"
              >
                Busque, explore e descubra
              </motion.span>
              tudo o que precisa saber!
            </motion.p>

            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative max-w-2xl mx-auto mb-8"
            >
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar suas dúvidas... (ex: 'como criar conta', 'segurança', 'fotos')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl text-white placeholder-slate-400 text-lg focus:border-blue-500/50 focus:bg-slate-800/70 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                />
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    ✕
                  </motion.button>
                )}
              </div>
              
              {/* Search suggestions */}
              {!searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-wrap gap-2 mt-4 justify-center"
                >
                  {["criar conta", "alterar senha", "privacidade", "reportar"].map((suggestion, i) => (
                    <motion.button
                      key={suggestion}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSearchQuery(suggestion)}
                      className="px-4 py-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-full text-sm text-slate-300 hover:text-white transition-all duration-200 border border-slate-600/30 hover:border-slate-500/50"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex items-center space-x-3 px-6 py-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm group
                    ${isActive 
                      ? `border-${category.color}-500/50 bg-gradient-to-r from-${category.color}-500/10 to-${category.color}-600/5 shadow-lg shadow-${category.color}-500/20` 
                      : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50 hover:bg-slate-800/50'
                    }
                  `}
                >
                  <IconComponent 
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isActive 
                        ? `text-${category.color}-400` 
                        : 'text-slate-400 group-hover:text-white'
                    }`} 
                  />
                  <span className={`font-medium transition-colors duration-300 ${
                    isActive 
                      ? `text-${category.color}-400` 
                      : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {category.name}
                  </span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-2 h-2 rounded-full bg-${category.color}-400`}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Search className="w-12 h-12 text-slate-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-300 mb-4">
                Nenhum resultado encontrado
              </h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Não encontramos nenhuma pergunta que corresponda à sua busca. 
                Tente termos diferentes ou entre em contato conosco.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors duration-200"
                >
                  Ver todas as perguntas
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowContact(true)}
                  className="px-6 py-3 border border-slate-600 hover:border-slate-500 rounded-xl transition-colors duration-200"
                >
                  Falar com suporte
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
              >
                <h2 className="text-2xl font-bold text-slate-200">
                  {filteredFAQs.length} Pergunta(s) 
                  {selectedCategory !== "all" && (
                    <span className="text-blue-400">
                      {" "}• {categories.find(c => c.id === selectedCategory)?.name}
                    </span>
                  )}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-slate-400">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Ordenadas por popularidade</span>
                </div>
              </motion.div>

              {filteredFAQs.map((faq, index) => {
                const isOpen = openItems.includes(faq.id);
                const category = categories.find(c => c.id === faq.category);
                
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.005 }}
                      className={`
                        relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-500
                        ${isOpen 
                          ? `border-${category?.color}-500/40 bg-gradient-to-br from-${category?.color}-500/5 to-transparent backdrop-blur-sm shadow-lg shadow-${category?.color}-500/10` 
                          : 'border-slate-700/40 bg-slate-800/20 hover:border-slate-600/50 hover:bg-slate-800/30'
                        }
                      `}
                      onClick={() => toggleItem(faq.id)}
                    >
                      {/* Glow effect */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`absolute inset-0 bg-gradient-to-r from-${category?.color}-500/5 via-transparent to-${category?.color}-600/5`}
                          />
                        )}
                      </AnimatePresence>

                      <div className="relative p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              {/* Popularity indicator */}
                              <motion.div
                                animate={isOpen ? { scale: 1.1, rotate: 360 } : {}}
                                transition={{ duration: 0.6 }}
                                className="flex items-center space-x-1"
                              >
                                <span className="text-lg">{getPopularityIcon(faq.popularity)}</span>
                                <span className={`text-xs font-medium ${getPopularityColor(faq.popularity)}`}>
                                  {faq.popularity}%
                                </span>
                              </motion.div>

                              {/* Category badge */}
                              {category && (
                                <div className={`px-3 py-1 rounded-full text-xs font-medium bg-${category.color}-500/10 text-${category.color}-400 border border-${category.color}-500/20`}>
                                  {category.name}
                                </div>
                              )}
                            </div>

                            <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                              isOpen ? `text-${category?.color}-400` : 'text-white group-hover:text-slate-200'
                            }`}>
                              {faq.question}
                            </h3>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-3">
                              {faq.tags.slice(0, 3).map((tag, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-slate-700/30 text-slate-400 text-xs rounded-lg"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {faq.tags.length > 3 && (
                                <span className="px-2 py-1 bg-slate-700/30 text-slate-400 text-xs rounded-lg">
                                  +{faq.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Expand icon */}
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className={`ml-4 p-3 rounded-xl transition-colors duration-300 ${
                              isOpen 
                                ? `bg-${category?.color}-500/20 text-${category?.color}-400` 
                                : 'bg-slate-700/30 text-slate-400 group-hover:bg-slate-600/40 group-hover:text-slate-300'
                            }`}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </motion.div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, y: -20 }}
                              animate={{ opacity: 1, height: "auto", y: 0 }}
                              exit={{ opacity: 0, height: 0, y: -20 }}
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                              className="mt-6 pt-6 border-t border-slate-700/30"
                            >
                              <div className={`p-6 rounded-2xl bg-gradient-to-br from-${category?.color}-500/5 to-transparent border border-${category?.color}-500/10`}>
                                <p className="text-slate-300 leading-relaxed text-lg mb-4">
                                  {faq.answer}
                                </p>
                                
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3 }}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                                    <CheckCircle2 className={`w-4 h-4 text-${category?.color}-400`} />
                                    <span>Resposta verificada pela equipe Red Shark</span>
                                  </div>
                                  
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex items-center space-x-2 px-4 py-2 bg-${category?.color}-500/10 hover:bg-${category?.color}-500/20 text-${category?.color}-400 rounded-lg transition-colors duration-200 text-sm`}
                                  >
                                    <Heart className="w-4 h-4" />
                                    <span>Útil</span>
                                  </motion.button>
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
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-20 grid md:grid-cols-2 gap-6"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-3xl p-8 text-center backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25"
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-blue-400 mb-2">
                Chat ao Vivo
              </h3>
              <p className="text-slate-300 mb-4 text-sm">
                Converse com nossa equipe em tempo real. Disponível 24/7 para ajudar você.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors duration-200 font-medium"
              >
                Iniciar Chat
              </motion.button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setShowContact(true)}
              className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-3xl p-8 text-center backdrop-blur-sm cursor-pointer"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25"
              >
                <Send className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-purple-400 mb-2">
                Enviar Mensagem
              </h3>
              <p className="text-slate-300 mb-4 text-sm">
                Não encontrou sua resposta? Envie sua pergunta e responderemos em breve.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors duration-200 font-medium"
              >
                Enviar Pergunta
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowContact(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Entre em Contato</h3>
                <p className="text-slate-400">Estamos aqui para ajudar você!</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-xl">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-slate-400 text-sm">suporte@redshark.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-xl">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Chat ao Vivo</p>
                    <p className="text-slate-400 text-sm">Disponível 24/7</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-slate-700/30 rounded-xl">
                  <Phone className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Telefone</p>
                    <p className="text-slate-400 text-sm">+55 (11) 99999-9999</p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowContact(false)}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl transition-colors duration-200 font-medium"
              >
                Fechar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}