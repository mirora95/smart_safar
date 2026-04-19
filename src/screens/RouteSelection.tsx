import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import BackButton from '../components/BackButton';
import { ChevronDown, ChevronUp } from 'lucide-react';

const routes = [
  { 
    id: '80', 
    name: 'Маршрутка №80', 
    stops: [
      'Рохи абрешим', '13 школа', '28мкр поворот', 'Доро', 'поворот на сторону моста', 
      'универмаг', 'стадион', 'паняшанбе', 'остановка около ТГУК', 'горбольница', 
      'Мавсим', 'поворот арбоб', 'автостанция', 'ГАИ ходжент', 'сомон базар', 
      'поворот Чкаловска', 'круг', 'ГМИТ', 'около входа в парк', 'памир базар', 
      'остановка в Южный квартал', 'аэропорт (конечный)'
    ]
  },
  { 
    id: '2', 
    name: 'Маршрутка №2', 
    stops: [
      'Масчити сурх', 'остановка род дом областной', 'остановка спутник', 'автовокзал', 
      'остановка кинотеатра ватан', 'остановка школы Ленина', 'остановка магазина Дусти', 
      'остановка детской больницы', 'остановка Авторимзавода', 'остановка Гулистон', 
      'остановка Панчшанбе(конечная)'
    ]
  }
];

export default function RouteSelection() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);

  const toggleRoute = (id: string) => {
    setExpandedRouteId(expandedRouteId === id ? null : id);
  };

  return (
    <motion.div className="p-6 pt-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="absolute top-4 left-4">
        <BackButton />
      </div>
      <h2 className="text-2xl font-bold mb-6">{t('selectRoute')}</h2>
      <div className="space-y-4">
        {routes.map(route => (
          <div key={route.id} className="border rounded-2xl shadow-sm overflow-hidden bg-white">
            <div 
              className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50"
              onClick={() => toggleRoute(route.id)}
            >
              <h3 className="font-bold text-lg">{t(`routeNo${route.id}` as any)}</h3>
              {expandedRouteId === route.id ? <ChevronUp /> : <ChevronDown />}
            </div>
            
            {expandedRouteId === route.id && (
              <div className="px-5 pb-5 pt-2 border-t">
                <h4 className="font-semibold text-sm text-slate-500 mb-3 uppercase tracking-wider">{t('stops')}:</h4>
                <ul className="space-y-2 mb-6">
                  {route.stops.map((stop, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {stop}
                    </li>
                  ))}
                </ul>
                <button 
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                  onClick={() => navigate(`/map?routeId=${route.id}`)}
                >
                  {t('showRoute')}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
