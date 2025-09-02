"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Shield, Lock, ArrowRight, CheckCircle, Sparkles, Star, Zap } from 'lucide-react';
import { ProgressBar, CodeInputCircles, BackButton } from '@/components/auth';
import { IRecoveryData } from '@/types/IRecoveryData';
import { useToast } from '@/hooks/useToast';

type Step = 1 | 2 | 3;

const PasswordRecovery = () => {
  const router = useRouter();
  const customToast = useToast();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  const [recoveryData, setRecoveryData] = useState<IRecoveryData>({
    email: '',
    code: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Partial<IRecoveryData>>({});

  // Initialize animations and particles on mount
  useEffect(() => {
    setIsVisible(true);
    
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  // Generate step transition animation
  const [stepDirection, setStepDirection] = useState<'forward' | 'backward'>('forward');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<IRecoveryData> = {};

    if (!recoveryData.email) {
      newErrors.email = 'Email e obrigatorio';
    } else if (!validateEmail(recoveryData.email)) {
      newErrors.email = 'Email invalido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<IRecoveryData> = {};

    if (!recoveryData.code) {
      newErrors.code = 'Codigo e obrigatorio';
    } else if (recoveryData.code.length !== 6) {
      newErrors.code = 'Codigo deve ter 6 digitos';
    } else if (!/^\d{6}$/.test(recoveryData.code)) {
      newErrors.code = 'Codigo deve conter apenas numeros';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Partial<IRecoveryData> = {};

    if (!recoveryData.password) {
      newErrors.password = 'Senha e obrigatoria';
    } else if (recoveryData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!recoveryData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmacao de senha e obrigatoria';
    } else if (recoveryData.password !== recoveryData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas nao coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof IRecoveryData, value: string) => {
    setRecoveryData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNextStep = async () => {
    setLoading(true);

    try {
      if (currentStep === 1) {
        if (!validateStep1()) return;
        
        // Simulate API call to send recovery email
        await new Promise(resolve => setTimeout(resolve, 1500));
        customToast.success('Codigo de recuperacao enviado para seu email!');
        setStepDirection('forward');
        setCurrentStep(2);

      } else if (currentStep === 2) {
        if (!validateStep2()) return;
        
        // Simulate API call to verify code
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock validation - accept any 6-digit code for demo
        if (recoveryData.code === '000000') {
          customToast.error('Codigo invalido! Tente novamente.');
          return;
        }
        
        customToast.success('Codigo verificado com sucesso!');
        setStepDirection('forward');
        setCurrentStep(3);

      } else if (currentStep === 3) {
        if (!validateStep3()) return;
        
        // Simulate API call to reset password
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        customToast.success('Senha alterada com sucesso!');
        
        // Redirect to login after success
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      customToast.error('Erro interno. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setStepDirection('backward');
      setCurrentStep((prev) => (prev - 1) as Step);
      setErrors({});
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  const steps = [
    { step: 1, icon: Mail, label: 'Email' },
    { step: 2, icon: Shield, label: 'Verificação' },
    { step: 3, icon: Lock, label: 'Nova Senha' }
  ];

  const renderStep1 = () => (
    <div className={`
      space-y-8 transition-all duration-700 transform
      ${stepDirection === 'forward' ? 'animate-slideInRight' : 'animate-slideInLeft'}
    `}>
      <div className="text-center relative">
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/25 transform hover:scale-110 transition-all duration-300">
            <Mail className="w-10 h-10 text-white animate-bounce" />
            <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 animate-spin" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent mb-3 animate-fadeIn">
          Recuperar Senha
        </h2>
        <p className="text-slate-400 text-lg animate-fadeIn" style={{animationDelay: '0.2s'}}>
          Digite seu email para receber o código de recuperação de sua conta
        </p>
      </div>

      <div className="space-y-6 animate-fadeIn" style={{animationDelay: '0.4s'}}>
        <div className="relative">
          <Label htmlFor="email" className="text-slate-300 font-medium text-sm uppercase tracking-wider">Email</Label>
          <div className="relative mt-3">
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={recoveryData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`
                bg-slate-800/50 border-2 border-slate-700 text-white placeholder-slate-400 
                h-14 text-lg rounded-xl backdrop-blur-sm
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 focus:bg-slate-800/70
                transition-all duration-300 transform hover:scale-[1.02]
                ${errors.email ? 'border-red-500 animate-shake' : ''}
              `}
              disabled={loading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Mail className="w-5 h-5 text-slate-400" />
            </div>
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-400 animate-slideDown flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={`
      space-y-8 transition-all duration-700 transform
      ${stepDirection === 'forward' ? 'animate-slideInRight' : 'animate-slideInLeft'}
    `}>
      <div className="text-center relative">
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse opacity-50" />
          <div className="relative w-full h-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/25 transform hover:scale-110 transition-all duration-300">
            <Shield className="w-10 h-10 text-white animate-pulse" />
            <Star className="absolute -top-2 -left-2 w-4 h-4 text-yellow-400 animate-ping" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent mb-3 animate-fadeIn">
          Código de Verificação
        </h2>
        <p className="text-slate-400 text-lg animate-fadeIn" style={{animationDelay: '0.2s'}}>
          Digite o código de 6 dígitos enviado para
        </p>
        <p className="text-blue-400 font-bold text-lg animate-fadeIn" style={{animationDelay: '0.3s'}}>
          {recoveryData.email} 📧
        </p>
      </div>

      <div className="space-y-6 animate-fadeIn" style={{animationDelay: '0.5s'}}>
        {/* Code input circles */}
        <CodeInputCircles 
          code={recoveryData.code}
          onCodeChange={(code) => handleInputChange('code', code)}
          disabled={loading}
          autoFocus
        />
        
        {errors.code && (
          <p className="text-center text-sm text-red-400 animate-shake flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            {errors.code}
          </p>
        )}
        
        <div className="text-center animate-fadeIn" style={{animationDelay: '0.7s'}}>
          <p className="text-sm text-slate-500 mb-2">
            Não recebeu o código? 
          </p>
          <button 
            className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-all duration-300 transform hover:scale-105 underline-offset-4 hover:underline"
            onClick={() => {
              customToast.info('Código reenviado!');
            }}
          >
            Reenviar código ↗️
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={`
      space-y-8 transition-all duration-700 transform
      ${stepDirection === 'forward' ? 'animate-slideInRight' : 'animate-slideInLeft'}
    `}>
      <div className="text-center relative">
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-pulse opacity-50" />
          <div className="relative w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/25 transform hover:scale-110 transition-all duration-300">
            <Lock className="w-10 h-10 text-white animate-bounce" />
            <Zap className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 animate-ping" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-3 animate-fadeIn">
          Nova Senha
        </h2>
        <p className="text-slate-400 text-lg animate-fadeIn" style={{animationDelay: '0.2s'}}>
          Crie uma senha super segura 🔐✨
        </p>
      </div>

      <div className="space-y-6 animate-fadeIn" style={{animationDelay: '0.4s'}}>
        <div className="relative">
          <Label htmlFor="password" className="text-slate-300 font-medium text-sm uppercase tracking-wider">Nova Senha</Label>
          <div className="relative mt-3">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua nova senha"
              value={recoveryData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`
                bg-slate-800/50 border-2 border-slate-700 text-white placeholder-slate-400 
                h-14 text-lg rounded-xl backdrop-blur-sm pr-14
                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25 focus:bg-slate-800/70
                transition-all duration-300 transform hover:scale-[1.02]
                ${errors.password ? 'border-red-500 animate-shake' : ''}
              `}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-all duration-300 transform hover:scale-110"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-400 animate-slideDown flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {errors.password}
            </p>
          )}
        </div>

        <div className="relative">
          <Label htmlFor="confirmPassword" className="text-slate-300 font-medium text-sm uppercase tracking-wider">Confirmar Nova Senha</Label>
          <div className="relative mt-3">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirme sua nova senha"
              value={recoveryData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`
                bg-slate-800/50 border-2 border-slate-700 text-white placeholder-slate-400 
                h-14 text-lg rounded-xl backdrop-blur-sm pr-14
                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25 focus:bg-slate-800/70
                transition-all duration-300 transform hover:scale-[1.02]
                ${errors.confirmPassword ? 'border-red-500 animate-shake' : ''}
              `}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-all duration-300 transform hover:scale-110"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-400 animate-slideDown flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 animate-fadeIn" style={{animationDelay: '0.6s'}}>
          <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            Dicas de segurança:
          </h4>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Mínimo de 6 caracteres</li>
            <li>• Combine letras, números e símbolos</li>
            <li>• Use uma senha única e forte 💪</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-transparent to-purple-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${3 + (particle.id % 3)}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className={`
          w-full max-w-md transition-all duration-1000 transform
          ${isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-8'}
        `}>
          <Card className="bg-slate-800/60 border-slate-700/60 backdrop-blur-sm shadow-2xl shadow-blue-500/10 border-2 overflow-hidden relative">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            
            {/* Back Arrow */}
            <BackButton 
              onClick={handlePreviousStep}
              disabled={loading}
              show={currentStep > 1}
            />
            
            <div className="space-y-1 pb-6 pt-12 px-6">
              <ProgressBar steps={steps} currentStep={currentStep} />
            </div>

            <div className="space-y-6 px-6 pb-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              <div className="flex flex-col gap-3 animate-fadeIn" style={{animationDelay: '0.8s'}}>
                <Button
                  onClick={handleNextStep}
                  disabled={loading}
                  className="
                    w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                    text-white font-medium py-4 h-14 text-lg rounded-xl
                    shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30
                    transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5
                    disabled:transform-none disabled:shadow-lg
                  "
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{currentStep === 1 ? 'Enviando código mágico...' : currentStep === 2 ? 'Verificando...' : 'Salvando nova senha...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center">
                      {currentStep === 3 ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Finalizar</span>
                          <Sparkles className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>Próximo</span>
                          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                  )}
                </Button>

              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;