import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Registration() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Студент');

  const handleRegister = () => {
    if (!phone || !password) {
      alert(t('fillAllFields'));
      return;
    }

    // In a real app, we would send this to a server
    const userData = {
      phone,
      password, // Storing password in localStorage is for demo only
      type: userType,
      role: 'user' as const
    };

    // Save to "database" (localStorage)
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    users.push(userData);
    localStorage.setItem('registered_users', JSON.stringify(users));

    // Log the user in
    login({ phone, type: userType, role: 'user' });
    navigate('/map');
  };

  return (
    <motion.div 
      className="flex h-screen flex-col items-center justify-center p-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute top-6 left-6 z-20">
        <BackButton />
      </div>
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/transport/1920/1080?blur=4" 
          alt="Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
      </div>
      <div className="relative z-10 w-full max-w-md card glass-morphism p-8">
        <h2 className="mb-8 text-3xl font-bold text-slate-900 tracking-tight">{t('register')}</h2>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">{t('phoneNumber')}</label>
            <input 
              type="tel" 
              placeholder="+992 00 000 0000" 
              className="w-full px-5 py-4 bg-slate-50/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">{t('password')}</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-5 py-4 bg-slate-50/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-[10px] text-slate-400 ml-1">{t('dontForgetPassword')}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">{t('userType')}</label>
            <select 
              className="w-full px-5 py-4 bg-slate-50/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none appearance-none"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="Студент">{t('student')}</option>
              <option value="Рабочий">{t('worker')}</option>
              <option value="Турист">{t('tourist')}</option>
              <option value="Ученик">{t('pupil')}</option>
            </select>
          </div>
          
          <div className="pt-4">
            <button 
              onClick={handleRegister}
              className="btn-primary w-full !py-4 shadow-blue-200"
            >
              {t('register')}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-sm font-semibold text-blue-600 hover:underline">
            {t('alreadyHaveAccountLogin')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
