"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, User, Mail, Lock, Calendar, MapPin, Heart, Camera, FileText, ArrowRight, CheckCircle, Sparkles, Star, Zap } from 'lucide-react';
import { IRegisterRequest } from '@/types/IUser';
import { ProgressBar, CodeInputCircles, BackButton } from '@/components/auth';
import { useToast } from '@/hooks/useToast';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

type Step = 1 | 2 | 3;

const RegisterPage = () => {
  const router = useRouter();
  const customToast = useToast();
  
  // Redirect authenticated users to home
  useAuthRedirect({ redirectIfAuthenticated: true });
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const [stepDirection, setStepDirection] = useState<'forward' | 'backward'>('forward');
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState('');

  const [registerData, setRegisterData] = useState<IRegisterRequest>({
    userName: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    state: '',
    city: '',
    dateOfBirth: '',
    maritalStatus: '',
    biography: '',
    profileImage: null
  });

  const [errors, setErrors] = useState<Partial<IRegisterRequest>>({});


  useEffect(() => {
    setIsVisible(true);
    
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  const validateStep1 = (): boolean => {
    const newErrors: Partial<IRegisterRequest> = {};

    if (!registerData.userName) {
      newErrors.userName = 'Nome de usuário é obrigatório';
    } else if (registerData.userName.length < 3) {
      newErrors.userName = 'Nome de usuário deve ter pelo menos 3 caracteres';
    }

    if (!registerData.name) {
      newErrors.name = 'Nome é obrigatório';
    } else if (registerData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!registerData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!registerData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (registerData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?._\-+=])/.test(registerData.password)) {
      newErrors.password = 'Senha deve ter maiúscula, minúscula, número e símbolo';
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<IRegisterRequest> = {};

    if (!registerData.dateOfBirth) {
      newErrors.dateOfBirth = 'Data de nascimento é obrigatória';
    } else {
      const birthDate = new Date(registerData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.dateOfBirth = 'Você deve ter pelo menos 13 anos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    if (!confirmationCode) {
      customToast.error('Digite o código de confirmação');
      return false;
    }
    if (confirmationCode.length !== 6) {
      customToast.error('Código deve ter 6 dígitos');
      return false;
    }
    if (!/^\d{6}$/.test(confirmationCode)) {
      customToast.error('Código deve conter apenas números');
      return false;
    }
    return true;
  };

  const handleInputChange = (field: keyof IRegisterRequest, value: string | File) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Handle profile image preview
    if (field === 'profileImage' && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    }
  };

  const handleNextStep = async () => {
    setLoading(true);

    try {
      if (currentStep === 1) {
        if (!validateStep1()) return;
        
        customToast.success('Informações básicas validadas!');
        setStepDirection('forward');
        setCurrentStep(2);
      } else if (currentStep === 2) {
        if (!validateStep2()) return;
        
        // Submit form and send confirmation email
        const formData = new FormData();
        formData.append('userName', registerData.userName);
        formData.append('name', registerData.name);
        formData.append('email', registerData.email);
        formData.append('password', registerData.password);
        formData.append('confirmPassword', registerData.confirmPassword);
        formData.append('state', registerData.state);
        formData.append('city', registerData.city);
        formData.append('dateOfBirth', registerData.dateOfBirth);
        formData.append('maritalStatus', registerData.maritalStatus);
        formData.append('biography', registerData.biography);
        
        if (registerData.profileImage) {
          formData.append('profileImage', registerData.profileImage);
        }

        // Simulate API call to create account and send email
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        customToast.success('Conta criada! Enviando código de confirmação...');
        setStepDirection('forward');
        setCurrentStep(3);
      } else if (currentStep === 3) {
        if (!validateStep3()) return;
        
        // Handle email confirmation
        await new Promise(resolve => setTimeout(resolve, 1500));
        customToast.success('Email confirmado com sucesso!');
        
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      customToast.error('Erro ao processar. Tente novamente.');
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

  const maritalStatusOptions = [
    { value: '', label: 'Selecionar...' },
    { value: 'single', label: 'Solteiro(a)' },
    { value: 'married', label: 'Casado(a)' },
    { value: 'divorced', label: 'Divorciado(a)' },
    { value: 'widowed', label: 'Viúvo(a)' },
    { value: 'complicated', label: 'Complicado' }
  ];

  const steps = [
    { step: 1, icon: Lock, label: 'Dados Básicos' },
    { step: 2, icon: User, label: 'Perfil' },
    { step: 3, icon: Mail, label: 'Confirmação' }
  ];

  const renderStep1 = () => (
    <div className={`
      space-y-6 transition-all duration-700 transform
      ${stepDirection === 'forward' ? 'animate-slideInRight' : 'animate-slideInLeft'}
    `}>
      <div className="text-center relative">
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/25 transform hover:scale-110 transition-all duration-300">
            <User className="w-10 h-10 text-white animate-bounce" />
            <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 animate-spin" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent mb-3 animate-fadeIn">
          Criar Conta
        </h2>
        <p className="text-slate-400 text-lg animate-fadeIn" style={{animationDelay: '0.2s'}}>
          Informações básicas para começar 🚀
        </p>
      </div>

      {/* Form Step 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn" style={{animationDelay: '0.4s'}}>
        {/* Username */}
        <div className="relative">
          <Label htmlFor="userName" className="text-slate-300 font-medium text-sm uppercase tracking-wider">Nome de usuário</Label>
          <div className="relative mt-3">
            <Input
              id="userName"
              type="text"
              placeholder="@usuario"
              value={registerData.userName}
              onChange={(e) => handleInputChange('userName', e.target.value)}
              className={`
                bg-slate-800/50 border-2 border-slate-700 text-white placeholder-slate-400 
                h-12 rounded-xl backdrop-blur-sm pl-12
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 focus:bg-slate-800/70
                transition-all duration-300 transform hover:scale-[1.02]
                ${errors.userName ? 'border-red-500 animate-shake' : ''}
              `}
              disabled={loading}
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          {errors.userName && (
            <p className="mt-2 text-sm text-red-400 animate-slideDown flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {errors.userName}
            </p>
          )}
        </div>

        {/* Name */}
        <div className="relative">
          <Label htmlFor="name" className="text-slate-300 font-medium text-sm uppercase tracking-wider">Nome completo</Label>
          <div className="relative mt-3">
            <Input
              id="name"
              type="text"
              placeholder="Seu nome completo"
              value={registerData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`
                bg-slate-800/50 border-2 border-slate-700 text-white placeholder-slate-400 
                h-12 rounded-xl backdrop-blur-sm
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 focus:bg-slate-800/70
                transition-all duration-300 transform hover:scale-[1.02]
                ${errors.name ? 'border-red-500 animate-shake' : ''}
              `}
              disabled={loading}
            />
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-red-400 animate-slideDown flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="relative md:col-span-2">
          <Label htmlFor="email" className="text-slate-300 font-medium text-sm uppercase tracking-wider">Email</Label>
          <div className="relative mt-3">
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={registerData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`
                bg-slate-800/50 border-2 border-slate-700 text-white placeholder-slate-400 
                h-12 rounded-xl backdrop-blur-sm pl-12
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 focus:bg-slate-800/70
                transition-all duration-300 transform hover:scale-[1.02]
                ${errors.email ? 'border-red-500 animate-shake' : ''}
              `}
              disabled={loading}
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-400 animate-slideDown flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <Label htmlFor="password" className="text-slate-300 font-medium text-sm uppercase tracking-wider">Senha</Label>
          <div className="relative mt-3">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              value={registerData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`
                bg-slate-800/50 border-2 border-slate-700 text-white placeholder-slate-400 
                h-12 rounded-xl backdrop-blur-sm pl-12 pr-12
                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25 focus:bg-slate-800/70
                transition-all duration-300 transform hover:scale-[1.02]
                ${errors.password ? 'border-red-500 animate-shake' : ''}
              `}
              disabled={loading}
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-all duration-300 transform hover:scale-110"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-400 animate-slideDown flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Label htmlFor="confirmPassword" className="text-slate-300 font-medium text-sm uppercase tracking-wider">Confirmar senha</Label>
          <div className="relative mt-3">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirme sua senha"
              value={registerData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`
                bg-slate-800/50 border-2 border-slate-700 text-white placeholder-slate-400 
                h-12 rounded-xl backdrop-blur-sm pl-12 pr-12
                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25 focus:bg-slate-800/70
                transition-all duration-300 transform hover:scale-[1.02]
                ${errors.confirmPassword ? 'border-red-500 animate-shake' : ''}
              `}
              disabled={loading}
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-all duration-300 transform hover:scale-110"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-400 animate-slideDown flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 animate-fadeIn" style={{animationDelay: '0.6s'}}>
        <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-green-400" />
          Requisitos da senha:
        </h4>
        <ul className="text-xs text-slate-400 space-y-1">
          <li>• Mínimo de 8 caracteres</li>
          <li>• Uma letra maiúscula</li>
          <li>• Uma letra minúscula</li>
          <li>• Um número</li>
          <li>• Um símbolo especial</li>
        </ul>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={`
      space-y-6 transition-all duration-700 transform
      ${stepDirection === 'forward' ? 'animate-slideInRight' : 'animate-slideInLeft'}
    `}>
      <div className="text-center relative">
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse opacity-50" />
          <div className="relative w-full h-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/25 transform hover:scale-110 transition-all duration-300">
            <User className="w-10 h-10 text-white animate-pulse" />
            <Star className="absolute -top-2 -left-2 w-4 h-4 text-yellow-400 animate-ping" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent mb-3 animate-fadeIn">
          Quase lá!
        </h2>
        <p className="text-slate-400 text-lg animate-fadeIn" style={{animationDelay: '0.2s'}}>
          Conte-nos mais sobre você 📸✨
        </p>
      </div>

      {/* Profile Image Upload */}
      <div className="relative animate-fadeIn" style={{animationDelay: '0.4s'}}>
        <Label className="text-slate-300 font-medium text-sm uppercase tracking-wider">Foto de perfil (opcional)</Label>
        <div className="relative mt-3 flex flex-col items-center">
          <label className="relative cursor-pointer group">
            {profileImagePreview ? (
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg shadow-blue-500/25 transition-all duration-300 group-hover:border-blue-400 group-hover:shadow-blue-400/30 group-hover:scale-105">
                <img src={profileImagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            ) : (
              <div className="w-28 h-28 rounded-full bg-slate-700 border-4 border-slate-600 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:border-blue-500 group-hover:bg-slate-600 group-hover:scale-105">
                <Camera className="w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleInputChange('profileImage', e.target.files[0])}
              className="hidden"
              disabled={loading}
            />
          </label>
          <p className="mt-3 text-xs text-slate-400 text-center">
            Clique na imagem para {profileImagePreview ? 'alterar' : 'adicionar'} sua foto
          </p>
        </div>
      </div>

      {/* Form Step 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn" style={{animationDelay: '0.6s'}}>
        {/* Date of Birth */}
        <div className="relative">
          <Label htmlFor="dateOfBirth" className="text-slate-300 font-medium text-sm uppercase tracking-wider">Data de nascimento</Label>
          <div className="relative mt-3">
            <Input
              id="dateOfBirth"
              type="date"
              value={registerData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className={`
                bg-slate-800/50 border-2 border-slate-700 text-white placeholder-slate-400 
                h-12 rounded-xl backdrop-blur-sm pl-12
                focus:border-green-500 focus:ring-2 focus:ring-green-500/25 focus:bg-slate-800/70
                transition-all duration-300 transform hover:scale-[1.02]
                ${errors.dateOfBirth ? 'border-red-500 animate-shake' : ''}
              `}
              disabled={loading}
            />
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          {errors.dateOfBirth && (
            <p className="mt-2 text-sm text-red-400 animate-slideDown flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {errors.dateOfBirth}
            </p>
          )}
        </div>

        {/* Marital Status */}
        <div className="relative">
          <Label htmlFor="maritalStatus" className="text-slate-300 font-medium text-sm uppercase tracking-wider">Estado civil</Label>
          <div className="relative mt-3">
            <select
              id="maritalStatus"
              value={registerData.maritalStatus}
              onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
              className={`
                w-full bg-slate-800/50 border-2 border-slate-700 text-white 
                h-12 rounded-xl backdrop-blur-sm pl-12 pr-4
                focus:border-pink-500 focus:ring-2 focus:ring-pink-500/25 focus:bg-slate-800/70
                transition-all duration-300 transform hover:scale-[1.02]
                appearance-none cursor-pointer
              `}
              disabled={loading}
            >
              {maritalStatusOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                  {option.label}
                </option>
              ))}
            </select>
            <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* State */}
        <div className="relative">
          <Label htmlFor="state" className="text-slate-300 font-medium text-sm uppercase tracking-wider">Estado</Label>
          <div className="relative mt-3">
            <Input
              id="state"
              type="text"
              placeholder="Ex: São Paulo"
              value={registerData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className={`
                bg-slate-800/50 border-2 border-slate-700 text-white placeholder-slate-400 
                h-12 rounded-xl backdrop-blur-sm pl-12
                focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 focus:bg-slate-800/70
                transition-all duration-300 transform hover:scale-[1.02]
              `}
              disabled={loading}
            />
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* City */}
        <div className="relative">
          <Label htmlFor="city" className="text-slate-300 font-medium text-sm uppercase tracking-wider">Cidade</Label>
          <div className="relative mt-3">
            <Input
              id="city"
              type="text"
              placeholder="Ex: São Paulo"
              value={registerData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={`
                bg-slate-800/50 border-2 border-slate-700 text-white placeholder-slate-400 
                h-12 rounded-xl backdrop-blur-sm pl-12
                focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 focus:bg-slate-800/70
                transition-all duration-300 transform hover:scale-[1.02]
              `}
              disabled={loading}
            />
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Biography */}
        <div className="relative md:col-span-2">
          <Label htmlFor="biography" className="text-slate-300 font-medium text-sm uppercase tracking-wider">Biografia (opcional)</Label>
          <div className="relative mt-3">
            <textarea
              id="biography"
              placeholder="Conte um pouco sobre você... 📝"
              value={registerData.biography}
              onChange={(e) => handleInputChange('biography', e.target.value)}
              rows={3}
              className={`
                w-full bg-slate-800/50 border-2 border-slate-700 text-white placeholder-slate-400 
                rounded-xl backdrop-blur-sm p-4 pl-12 resize-none
                focus:border-teal-500 focus:ring-2 focus:ring-teal-500/25 focus:bg-slate-800/70
                transition-all duration-300 transform hover:scale-[1.02]
              `}
              disabled={loading}
              maxLength={500}
            />
            <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
          </div>
          <div className="text-right text-xs text-slate-500 mt-1">
            {registerData.biography.length}/500
          </div>
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse opacity-50" />
          <div className="relative w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/25 transform hover:scale-110 transition-all duration-300">
            <Mail className="w-10 h-10 text-white animate-bounce" />
            <Star className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 animate-spin" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent mb-3 animate-fadeIn">
          Confirme seu Email
        </h2>
        <p className="text-slate-400 text-lg animate-fadeIn" style={{animationDelay: '0.2s'}}>
          Digite o código de 6 dígitos enviado para
        </p>
        <p className="text-blue-400 font-bold text-lg animate-fadeIn" style={{animationDelay: '0.3s'}}>
          {registerData.email} 📧
        </p>
      </div>

      <div className="space-y-6 animate-fadeIn" style={{animationDelay: '0.5s'}}>
        {/* Code input circles */}
        <CodeInputCircles 
          code={confirmationCode}
          onCodeChange={setConfirmationCode}
          disabled={loading}
          autoFocus
        />
        
        <div className="text-center animate-fadeIn" style={{animationDelay: '0.7s'}}>
          <p className="text-sm text-slate-500 mb-4">
            Não recebeu o código? Verifique sua caixa de spam ou aguarde alguns minutos.
          </p>
          <button 
            className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-all duration-300 transform hover:scale-105 underline-offset-4 hover:underline"
            onClick={() => {
              customToast.info('Código reenviado para seu email!');
            }}
          >
            Reenviar código ↗️
          </button>
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 animate-fadeIn" style={{animationDelay: '0.9s'}}>
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          <Sparkles className="w-4 h-4 text-green-400" />
          <span>Sua conta será ativada assim que confirmarmos seu email</span>
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
          w-full max-w-2xl transition-all duration-1000 transform
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
                      <span>
                        {currentStep === 1 ? 'Validando...' : 
                         currentStep === 2 ? 'Criando conta...' : 
                         'Confirmando email...'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center">
                      {currentStep === 3 ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Confirmar Email</span>
                          <Sparkles className="w-4 h-4" />
                        </>
                      ) : currentStep === 2 ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Criar Conta</span>
                          <Sparkles className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>Próxima Etapa</span>
                          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleBackToLogin}
                  disabled={loading}
                  className="
                    w-full border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400/70
                    h-12 rounded-xl transition-all duration-300 transform hover:scale-[1.02]
                    backdrop-blur-sm
                  "
                >
                  {currentStep === 1 ? 'Já tem conta? Fazer login' : 
                   currentStep === 3 ? 'Voltar ao login' : 'Cancelar e voltar ao login'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.7s ease-out forwards;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.7s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;