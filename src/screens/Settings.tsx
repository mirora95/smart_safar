import { motion } from 'motion/react';
import { Instagram, LogOut, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import BackButton from '../components/BackButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { routes } from '../constants/routes';
import { useState, useEffect } from 'react';

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favorite_routes') || '[]');
    setFavorites(stored);
  }, []);

  const favoriteRoutes = routes.filter(r => favorites.includes(r.id));

  const handleDonate = () => {
    window.open('https://dcity.tj/donate', '_blank');
  };

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  return (
    <motion.div 
      className={`min-h-screen p-6 pt-20 ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`} 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
    >
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>
      <h2 className="text-2xl font-bold mb-6">{t('settings')}</h2>
      
      <div className="space-y-6 max-w-md mx-auto">
        <div className={`card ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-bold uppercase mb-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                {t('language')}
              </label>
              <select 
                className={`w-full p-4 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all ${theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`} 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as any)}
              >
                <option value="Tajik">Тоҷикӣ</option>
                <option value="English">English</option>
                <option value="Russian">Русский</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase mb-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                {t('colorTheme')}
              </label>
              <button 
                onClick={toggleTheme}
                className={`w-full p-4 flex items-center justify-between rounded-2xl text-sm transition-all ${theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
              >
                <span>{theme === 'dark' ? t('darkTheme') : t('lightTheme')}</span>
                {theme === 'dark' ? <Moon size={20} className="text-blue-400" /> : <Sun size={20} className="text-amber-500" />}
              </button>
            </div>
          </div>
        </div>

        <div className={`card ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
          <h3 className={`text-sm font-bold uppercase mb-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            {t('favorites')}
          </h3>
          <div className="space-y-2">
            {favoriteRoutes.length > 0 ? (
              favoriteRoutes.map(route => (
                <div 
                  key={route.id}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-100 hover:bg-slate-50'}`} 
                  onClick={() => navigate(`/map?routeId=${route.id}`)}
                >
                  <p className="font-bold text-sm">{t(`routeNo${route.id}` as any)}</p>
                  <p className="text-xs text-slate-500">{route.description}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4 italic">
                {language === 'English' ? 'No favorites yet' : language === 'Russian' ? 'Нет избранных маршрутов' : 'Ҳанӯз дӯстдоштаҳо нест'}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full btn-primary !py-4 shadow-amber-100 bg-amber-400 hover:bg-amber-500" onClick={handleDonate}>
            {t('donate')}
          </button>
          
          <button 
            className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100 shadow-sm'}`} 
            onClick={() => window.open('https://www.instagram.com/SMART_SAFAR', '_blank')}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center text-white">
              <Instagram size={24} />
            </div>
            <div className="text-left">
              <span className="font-bold text-sm">@SMART_SAFAR</span>
              <p className="text-xs text-slate-500 mt-0.5">{t('supportText')}</p>
            </div>
          </button>

          <button 
            className={`w-full p-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${theme === 'dark' ? 'text-rose-400 border border-rose-900/30 bg-rose-900/10' : 'text-rose-600 border border-rose-100 bg-rose-50'}`} 
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
