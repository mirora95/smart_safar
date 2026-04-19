import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import { Bus, User, Navigation, Search as SearchIcon, Settings as SettingsIcon, Heart } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { routes, trams } from '../constants/routes';

const userLocationIcon = L.divIcon({
  html: renderToString(
    <div className="relative flex items-center justify-center" style={{ width: '32px', height: '42px' }}>
      {/* Shadow */}
      <div className="absolute bottom-0 w-3 h-1.5 bg-black/20 blur-[1px] rounded-full"></div>
      
      {/* Pin Body */}
      <div className="relative flex flex-col items-center">
        <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
          <User className="text-white" size={18} fill="currentColor" />
        </div>
        {/* Pin Tip */}
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-blue-600 -mt-1"></div>
      </div>
      
      {/* Pulse Effect */}
      <div className="absolute inset-0 w-full h-full bg-blue-500/30 rounded-full animate-ping -z-10 scale-75"></div>
    </div>
  ),
  className: 'bg-transparent',
  iconSize: [32, 42],
  iconAnchor: [16, 42],
});

const createRealisticTramIcon = (color: string, number: string) => {
  const mainColor = color === 'blue' ? '#2563eb' : color === 'red' ? '#dc2626' : '#059669';
  
  return L.divIcon({
    html: renderToString(
      <div className="relative flex items-center justify-center" style={{ width: '40px', height: '40px' }}>
        <div 
          className="flex items-center justify-center"
          style={{ 
            color: mainColor
          }}
        >
          <Bus size={28} strokeWidth={2.5} />
          <div className="absolute -bottom-4 bg-white px-1 rounded border border-slate-200 shadow-sm">
             <span className="text-[10px] font-bold text-slate-800">{number}</span>
          </div>
        </div>
      </div>
    ),
    className: 'bg-transparent',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

export default function MapScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const routeId = searchParams.get('routeId');
  const stopParam = searchParams.get('stop');
  const selectedRoute = routes.find(r => r.id === routeId) || routes.find(r => r.stops.includes(stopParam || ''));
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [isSignaling, setIsSignaling] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('favorite_routes') || '[]');
  });

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('favorite_routes', JSON.stringify(newFavorites));
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserPos([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handleSignal = () => {
    if (!userPos || !selectedRoute) return;
    
    // In a real app, this would send data to Firestore
    const signal = {
      userId: 'user_' + Math.random().toString(36).substr(2, 9),
      routeId: selectedRoute.id,
      routeName: selectedRoute.name,
      position: userPos,
      timestamp: Date.now()
    };
    
    const existingSignals = JSON.parse(localStorage.getItem('passenger_signals') || '[]');
    localStorage.setItem('passenger_signals', JSON.stringify([...existingSignals, signal]));
    
    setIsSignaling(true);
    setTimeout(() => setIsSignaling(false), 3000);
  };

  return (
    <motion.div className={`h-screen relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <MapContainer center={selectedRoute ? (selectedRoute.path[0] as [number, number]) : [40.28, 69.63]} zoom={14} className="h-full w-full z-0" zoomControl={false}>
        <TileLayer url={theme === 'dark' ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"} />
        {userPos && (
          <Marker position={userPos} icon={userLocationIcon}>
            <Popup className="custom-popup">{t('youAreHere')}</Popup>
          </Marker>
        )}
        {selectedRoute && (
          <>
            <Polyline positions={selectedRoute.path as any} color={selectedRoute.color} weight={6} opacity={0.8} lineCap="round" />
            <Marker position={selectedRoute.path[0] as [number, number]} icon={userLocationIcon}>
              <Popup>{stopParam || selectedRoute.name}</Popup>
            </Marker>
          </>
        )}
        {trams.map((tram, i) => (
          <Marker 
            key={i} 
            position={tram.position as any} 
            icon={createRealisticTramIcon(tram.color, tram.number)}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[150px]">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-slate-900 text-base">{t('transportNo')}{tram.number}</p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(tram.id);
                    }}
                    className={`p-1.5 rounded-full transition-all ${favorites.includes(tram.id) ? 'text-rose-500 bg-rose-50' : 'text-slate-400 bg-slate-50'}`}
                  >
                    <Heart size={18} fill={favorites.includes(tram.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-slate-500 text-xs font-medium">{t('inTransit')}</p>
                </div>
                <button 
                  onClick={() => toggleFavorite(tram.id)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    favorites.includes(tram.id) 
                      ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}
                >
                  {favorites.includes(tram.id) ? t('removeFromFavorites') : t('addToFavorites')}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Top Navigation Bar */}
      <div className="absolute top-6 left-4 right-4 z-[1000] flex items-center justify-between pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <Link to="/routes" className={`glass-morphism px-4 py-2.5 rounded-2xl flex items-center gap-2 font-medium text-sm transition-all active:scale-95 ${theme === 'dark' ? 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700' : 'text-slate-700 hover:bg-white'}`}>
            <Navigation size={18} className="text-blue-600" />
            <span>{t('routes')}</span>
          </Link>
        </div>
        
        <div className="flex gap-2 pointer-events-auto">
          <Link to="/search" className={`glass-morphism p-2.5 rounded-2xl transition-all active:scale-95 ${theme === 'dark' ? 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700' : 'text-slate-600 hover:bg-white'}`}>
            <SearchIcon size={20} />
          </Link>
          <Link to="/settings" className={`glass-morphism p-2.5 rounded-2xl transition-all active:scale-95 ${theme === 'dark' ? 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700' : 'text-slate-600 hover:bg-white'}`}>
            <SettingsIcon size={20} />
          </Link>
        </div>
      </div>

      {/* Bottom Route Panel */}
      {selectedRoute && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-8 left-4 right-4 z-[1000] pointer-events-auto"
        >
          <div className={`card glass-morphism p-5 flex flex-col gap-4 ${theme === 'dark' ? 'bg-slate-800/90 border-slate-700' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: selectedRoute.color }}>
                  <Bus size={24} />
                </div>
                <div>
                  <h3 className={`font-bold text-lg leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t(`routeNo${selectedRoute.id}` as any)}</h3>
                  <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{t('nearestIn')} 8 {t('minutes')}</p>
                </div>
              </div>
              <button 
                onClick={handleSignal}
                disabled={isSignaling}
                className={`btn-primary !px-5 !py-3 ${isSignaling ? 'bg-green-500 shadow-green-100' : ''}`}
              >
                {isSignaling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('signalSent')}</span>
                  </>
                ) : (
                  <>
                    <Navigation size={18} />
                    <span>{t('waitingHere')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Floating Action Button for Donate */}
      <button 
        className="absolute bottom-8 right-4 z-[1000] w-14 h-14 bg-amber-400 text-white rounded-2xl shadow-xl shadow-amber-200 flex items-center justify-center hover:bg-amber-500 transition-all active:scale-95"
        onClick={() => window.open('https://dcity.tj/donate', '_blank')}
      >
        <Heart size={24} fill="currentColor" />
      </button>
    </motion.div>
  );
}
