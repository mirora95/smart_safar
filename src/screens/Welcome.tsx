import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Welcome() {
  const { t } = useLanguage();

  return (
    <motion.div 
      className="flex min-h-screen flex-col items-center justify-center bg-stone-50 p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-stone-900">{t('welcome')}</h1>
        <p className="text-lg text-stone-600">{t('welcomeSub')}</p>
        
        <div className="space-y-3 pt-6">
          <Link to="/registration" className="block w-full rounded-2xl bg-blue-600 py-4 text-white font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">{t('getStarted')}</Link>
          <Link to="/driver-login" className="block w-full rounded-2xl bg-white py-4 text-stone-900 font-semibold border border-stone-200 hover:bg-stone-50 transition-all">{t('iAmDriver')}</Link>
          <Link to="/admin-registration" className="block w-full rounded-2xl bg-white py-4 text-blue-700 font-semibold border border-blue-100 hover:bg-blue-50 transition-all">{t('iAmAdmin')}</Link>
          <Link to="/login" className="block pt-4 text-sm font-medium text-blue-700 hover:text-blue-900">{t('alreadyHaveAccount')}</Link>
        </div>
      </div>
    </motion.div>
  );
}
