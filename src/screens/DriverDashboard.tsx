import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Bus, MessageSquare, Map as MapIcon, History, Settings as SettingsIcon, Heart, User, ArrowLeft, Send, Clock, Play, Square, Bell, Navigation, LogOut, Moon, Sun } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const busIcon = L.divIcon({
  html: renderToString(
    <div className="relative flex items-center justify-center" style={{ width: '40px', height: '40px' }}>
      <div className="w-10 h-10 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
        <Bus size={24} />
      </div>
    </div>
  ),
  className: 'bg-transparent',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const userIcon = L.divIcon({
  html: renderToString(
    <div className="relative flex items-center justify-center" style={{ width: '32px', height: '42px' }}>
      {/* Shadow */}
      <div className="absolute bottom-0 w-3 h-1.5 bg-black/20 blur-[1px] rounded-full"></div>
      
      {/* Pin Body */}
      <div className="relative flex flex-col items-center">
        <div className="w-8 h-8 bg-rose-500 rounded-full border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
          <User className="text-white" size={18} fill="currentColor" />
        </div>
        {/* Pin Tip */}
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-rose-500 -mt-1"></div>
      </div>
      
      {/* Pulse Effect */}
      <div className="absolute inset-0 w-full h-full bg-rose-500/30 rounded-full animate-ping -z-10 scale-75"></div>
    </div>
  ),
  className: 'bg-transparent',
  iconSize: [32, 42],
  iconAnchor: [16, 42],
});

export default function DriverDashboard() {
  const { language, setLanguage, t } = useLanguage();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [driver, setDriver] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'chat' | 'history' | 'settings'>('map');
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Водитель №2', text: 'На 5-м микрорайоне пробка!', time: '12:30' },
    { sender: 'Водитель №5', text: 'Понял, спасибо.', time: '12:32' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  // Passenger signals from localStorage
  const [passengerSignals, setPassengerSignals] = useState<any[]>([]);
  
  // Time tracking
  const [isWorking, setIsWorking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  
  // Settings
  const [routeNumber, setRouteNumber] = useState('');
  const navigate = useNavigate();

  const status = driver?.status || 'idle';

  useEffect(() => {
    const d = localStorage.getItem('driver_account');
    const h = localStorage.getItem('workHistory');
    if (d) {
      const parsed = JSON.parse(d);
      setDriver(parsed);
      setRouteNumber(parsed.route || '');
    }
    if (h) setHistory(JSON.parse(h));

    // Load passenger signals
    const updateSignals = () => {
      const signals = JSON.parse(localStorage.getItem('passenger_signals') || '[]');
      setPassengerSignals(signals);
    };

    updateSignals();
    const interval = setInterval(updateSignals, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isWorking) {
      interval = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isWorking]);

  const toggleStatus = () => {
    const newStatus = status === 'idle' ? 'in-transit' : 'idle';
    const updatedDriver = { ...driver, status: newStatus };
    setDriver(updatedDriver);
    localStorage.setItem('driver_account', JSON.stringify(updatedDriver));
  };

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  const startWork = () => setIsWorking(true);
  const stopWork = () => {
    setIsWorking(false);
    const newHistory = [...history, elapsedTime];
    setHistory(newHistory);
    localStorage.setItem('workHistory', JSON.stringify(newHistory));
    setElapsedTime(0);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([...messages, { sender: 'Вы', text: newMessage, time }]);
      setNewMessage('');
    }
  };

  const saveSettings = () => {
    const updatedDriver = { ...driver, route: routeNumber };
    setDriver(updatedDriver);
    localStorage.setItem('driver_account', JSON.stringify(updatedDriver));
    alert('Настройки сохранены');
  };

  return (
    <motion.div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className={`glass-morphism sticky top-0 z-[1000] px-6 py-4 flex justify-between items-center ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : ''}`}>
        <button onClick={() => navigate(-1)} className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}>
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-lg leading-tight">Smart Safar Driver</h1>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${status === 'in-transit' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
            <span className={`text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {status === 'in-transit' ? t('online') : t('offline')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="p-2.5 rounded-xl bg-amber-400 text-white shadow-lg shadow-amber-100 hover:bg-amber-500 transition-all active:scale-95"
            onClick={() => window.open('https://next.dc.tj/', '_blank')}
          >
            <Heart size={20} fill="currentColor" />
          </button>
          <button 
            onClick={handleLogout}
            className={`p-2.5 rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-700 text-rose-400 hover:bg-slate-600' : 'bg-white text-rose-500 hover:bg-rose-50 border border-rose-100 shadow-sm'}`}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-6 max-w-2xl mx-auto pb-32">
        {/* Status Card */}
        <div className={`card flex flex-col gap-6 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('yourShift')}</h2>
              <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>{t('route')}: <span className="font-bold text-blue-600">{driver?.route || '—'}</span></p>
            </div>
            {status === 'in-transit' && (
              <div className="flex flex-col items-end">
                <span className={`text-xs font-bold uppercase ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t('timeInTransit')}</span>
                <span className="text-2xl font-mono font-bold text-blue-600">{formatTime(elapsedTime)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button 
              className={`flex-1 btn-primary !py-4 ${status === 'in-transit' ? 'bg-rose-500 shadow-rose-100 hover:bg-rose-600' : ''}`}
              onClick={toggleStatus}
            >
              {status === 'idle' ? (
                <>
                  <Play size={20} fill="currentColor" />
                  <span>{t('goOnline')}</span>
                </>
              ) : (
                <>
                  <Square size={20} fill="currentColor" />
                  <span>{t('endShift')}</span>
                </>
              )}
            </button>
            
            {status === 'in-transit' && (
              <button 
                className={`btn-secondary !px-4 ${isWorking ? 'text-rose-600 border-rose-100 bg-rose-50' : 'text-green-600 border-green-100 bg-green-50'}`}
                onClick={isWorking ? stopWork : startWork}
              >
                <Clock size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className={`card !p-0 overflow-hidden ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : ''}`}>
          <div className={`flex p-1.5 gap-1 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50/50'}`}>
            {[
              { id: 'map', icon: MapIcon, label: t('map') },
              { id: 'chat', icon: MessageSquare, label: t('chat') },
              { id: 'history', icon: History, label: t('history') },
              { id: 'settings', icon: SettingsIcon, label: t('settings') }
            ].map((tab) => (
              <button 
                key={tab.id}
                className={`flex-1 py-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? (theme === 'dark' ? 'bg-slate-700 text-blue-400 shadow-sm font-bold' : 'bg-white shadow-sm text-blue-600 font-bold') : (theme === 'dark' ? 'text-slate-500 hover:bg-slate-700/50' : 'text-slate-500 hover:bg-white/50')}`}
                onClick={() => setActiveTab(tab.id as any)}
              >
                <tab.icon size={20} />
                <span className="text-[10px] uppercase tracking-wider">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="p-6">
            {activeTab === 'map' ? (
              <div className="space-y-6">
                <div className={`h-80 rounded-3xl overflow-hidden border shadow-inner relative ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
                  <MapContainer center={[40.28, 69.63]} zoom={13} className="h-full w-full z-0" zoomControl={false}>
                    <TileLayer url={theme === 'dark' ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"} />
                    <Marker position={[40.28, 69.63]} icon={busIcon} />
                    {passengerSignals.map((signal, idx) => (
                      <Marker key={idx} position={signal.position} icon={userIcon}>
                        <Popup className="custom-popup">
                          <div className="p-2">
                            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('passengerWaiting')}</p>
                            <p className="text-xs text-blue-600 font-bold">{signal.routeName}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{new Date(signal.timestamp).toLocaleTimeString()}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                  
                  {/* Map Overlay Info */}
                  <div className="absolute bottom-4 left-4 right-4 z-[1000] pointer-events-none">
                    <div className={`glass-morphism p-3 rounded-2xl flex items-center justify-between pointer-events-auto ${theme === 'dark' ? 'bg-slate-800/90 border-slate-700' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                          <Bell size={20} />
                        </div>
                        <div>
                          <p className={`text-xs font-bold uppercase ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Сигналы</p>
                          <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{passengerSignals.length} пассажиров ждут</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className={`text-sm font-bold uppercase tracking-widest px-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t('activeSignals')}</h3>
                  {passengerSignals.length === 0 ? (
                    <div className={`p-8 text-center rounded-3xl border border-dashed ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                      <User className={`mx-auto mb-2 ${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'}`} size={32} />
                      <p className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}>{t('noSignals')}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {passengerSignals.map((signal, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-4 border rounded-2xl shadow-sm ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-100'}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                              <User size={20} />
                            </div>
                            <div>
                              <p className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('passengerWaiting')} {signal.routeName}</p>
                              <p className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}>{new Date(signal.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            <Navigation size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === 'chat' ? (
              <div className="h-[450px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.sender === 'Вы' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-3xl text-sm ${m.sender === 'Вы' ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-100' : (theme === 'dark' ? 'bg-slate-700 text-slate-200 rounded-tl-none' : 'bg-slate-100 text-slate-800 rounded-tl-none')}`}>
                        {m.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">{m.sender} • {m.time}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-2">
                  <input 
                    className={`flex-1 px-5 py-4 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none ${theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`} 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder={t('writeToColleagues')} 
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95" onClick={sendMessage}>
                    <Send size={20} />
                  </button>
                </div>
              </div>
            ) : activeTab === 'history' ? (
              <div className="space-y-4">
                <h3 className={`text-sm font-bold uppercase tracking-widest px-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t('lastSessions')}</h3>
                {history.length === 0 ? (
                  <div className="p-12 text-center">
                    <History className={`mx-auto mb-4 ${theme === 'dark' ? 'text-slate-700' : 'text-slate-200'}`} size={48} />
                    <p className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}>История поездок пуста</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((h, i) => (
                      <div key={i} className={`flex items-center justify-between p-4 border rounded-2xl ${theme === 'dark' ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-400'}`}>
                            <Clock size={20} />
                          </div>
                          <div>
                            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Сессия #{history.length - i}</p>
                            <p className={theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}>{t('sessionCompleted')}</p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-blue-600">{formatTime(h)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className={`text-sm font-bold uppercase tracking-widest px-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t('profileAndSettings')}</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase ml-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t('interfaceLanguage')}</label>
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

                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase ml-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t('routeNumber')}</label>
                    <input 
                      className={`w-full p-4 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all ${theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`} 
                      value={routeNumber} 
                      onChange={(e) => setRouteNumber(e.target.value)} 
                      placeholder="Например: 10" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-xs font-bold uppercase ml-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t('colorTheme')}</label>
                    <button 
                      onClick={toggleTheme}
                      className={`w-full p-4 flex items-center justify-between rounded-2xl text-sm transition-all ${theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
                    >
                      <span>{theme === 'dark' ? 'Тёмная' : 'Светлая'}</span>
                      {theme === 'dark' ? <Moon size={20} className="text-blue-400" /> : <Sun size={20} className="text-amber-500" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button className="btn-primary w-full !py-4" onClick={saveSettings}>
                    {t('saveSettings')}
                  </button>
                  <a href="https://instagram.com/SMART_SAFAR" target="_blank" rel="noopener noreferrer" className="block text-blue-600 font-bold text-center text-sm hover:underline py-2">
                    {t('ourInstagram')}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
