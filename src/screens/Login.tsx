import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!phone || !password) {
      alert(t('fillAllFields'));
      return;
    }

    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const user = users.find((u: any) => u.phone === phone && u.password === password);

    if (user) {
      login({ phone: user.phone, type: user.type, role: 'user' });
      navigate('/map');
    } else {
      alert(t('invalidCredentials'));
    }
  };

  return (
    <motion.div 
      className="flex h-screen flex-col items-center justify-center bg-blue-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute top-4 left-4 z-20">
        <BackButton />
      </div>
      <h2 className="mb-6 text-2xl font-bold text-blue-900">{t('login')}</h2>
      <input 
        type="tel" 
        placeholder={t('phoneNumber')} 
        className="mb-4 w-full rounded-lg border p-3" 
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input 
        type="password" 
        placeholder={t('password')} 
        className="mb-4 w-full rounded-lg border p-3" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button 
        onClick={handleLogin}
        className="w-full block text-center rounded-lg bg-blue-600 py-3 text-white font-semibold"
      >
        {t('login')}
      </button>
      <Link to="/forgot-password" className="mt-4 text-blue-600">{t('forgotPassword')}</Link>
    </motion.div>
  );
}
