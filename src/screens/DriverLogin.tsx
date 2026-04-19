import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function DriverLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [route, setRoute] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    const driver = localStorage.getItem('driver_account');
    if (driver) {
      const parsed = JSON.parse(driver);
      if (parsed.phone === phone && parsed.password === password) {
        login({ phone: parsed.phone, type: 'driver', role: 'driver' });
        navigate('/driver-dashboard');
      } else {
        alert('Неверный номер телефона или пароль.');
      }
    } else {
      alert('Водитель не найден. Пожалуйста, зарегистрируйтесь.');
    }
  };

  const handleRegister = () => {
    if (!phone || !password || !route) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }
    // Request location access
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location access granted', position.coords);
        const driverData = { phone, password, route, status: 'idle' };
        localStorage.setItem('driver_account', JSON.stringify(driverData));
        login({ phone, type: 'driver', role: 'driver' });
        alert('Вы успешно зарегистрировались!');
        navigate('/driver-dashboard');
      },
      (error) => {
        alert('Пожалуйста, предоставьте доступ к геолокации для работы.');
        console.error(error);
      }
    );
  };

  return (
    <motion.div 
      className="min-h-screen bg-stone-50 p-6 pt-20 flex justify-center" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-3xl font-extrabold text-stone-900">Водитель</h2>
        <div className="space-y-4">
          <input type="tel" placeholder="Номер телефона" className="w-full p-4 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none" onChange={(e) => setPhone(e.target.value)} />
          <input type="password" placeholder="Новый пароль" className="w-full p-4 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none" onChange={(e) => setPassword(e.target.value)} />
          <input type="text" placeholder="Ваша маршрутка" className="w-full p-4 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none" onChange={(e) => setRoute(e.target.value)} />
        </div>
        <div className="flex gap-3">
          <button className="flex-1 p-4 bg-emerald-600 text-white rounded-2xl font-semibold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all" onClick={handleLogin}>Войти</button>
          <button className="flex-1 p-4 bg-stone-900 text-white rounded-2xl font-semibold hover:bg-stone-800 transition-all" onClick={handleRegister}>Регистрация</button>
        </div>
        <p className="text-center text-xs text-stone-400 mt-4">Пожалуйста, не забудьте свой пароль.</p>
      </div>
    </motion.div>
  );
}
