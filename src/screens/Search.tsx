import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { useLanguage } from '../context/LanguageContext';

export default function Search() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // This should ideally come from a shared source
  const stops = [
    'Рохи абрешим', '13 школа', '28мкр поворот', 'Доро', 'поворот на сторону моста', 
    'универмаг', 'стадион', 'паняшанбе', 'остановка около ТГУК', 'горбольница', 
    'Мавсим', 'поворот арбоб', 'автостанция', 'ГАИ ходжент', 'сомон базар', 
    'поворот Чкаловска', 'круг', 'ГМИТ', 'около входа в парк', 'памир базар', 
    'остановка в Южный квартал', 'аэропорт (конечный)', 'Масчити сурх', 
    'остановка род дом областной', 'остановка спутник', 'автовокзал', 
    'остановка кинотеатра ватан', 'остановка школы Ленина', 'остановка магазина Дусти', 
    'остановка детской больницы', 'остановка Авторимзавода', 'остановка Гулистон', 
    'остановка Панчшанбе(конечная)'
  ];
  const filteredStops = stops.filter(stop => stop.toLowerCase().includes(query.toLowerCase()));

  return (
    <motion.div className="p-6 pt-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>
      <h2 className="text-2xl font-bold mb-4">{t('searchStop')}</h2>
      <input 
        type="text" 
        placeholder={t('enterStopName')}
        className="w-full p-3 border rounded-lg mb-4" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="space-y-2">
        {filteredStops.map(stop => (
          <div 
            key={stop} 
            className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50"
            onClick={() => navigate(`/map?stop=${encodeURIComponent(stop)}`)}
          >
            {stop}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
