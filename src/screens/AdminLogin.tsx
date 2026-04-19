import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function AdminLogin() {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === '4unix1niso2robiya3zaynura4mahliyo') {
      navigate('/admin-dashboard');
    } else {
      setError(t('invalidPassword'));
    }
  };

  return (
    <motion.div className="p-6 pt-20 min-h-screen bg-emerald-50 flex flex-col items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate('/welcome')} className="mb-4 text-emerald-600 font-semibold">← {t('back')}</button>
      <h2 className="text-2xl font-bold mb-6">{t('adminLogin')}</h2>
      <input 
        type="password" 
        className="w-full p-3 mb-4 border rounded-lg" 
        placeholder={t('enterPassword')} 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <button 
        className="w-full rounded-lg bg-emerald-600 py-3 text-white font-semibold" 
        onClick={handleLogin}
      >
        {t('login')}
      </button>
    </motion.div>
  );
}
