import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function AdminRegistration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    if (email && password) {
      localStorage.setItem('adminEmail', email);
      localStorage.setItem('adminPassword', password);
      navigate('/admin-dashboard');
    } else {
      setError('Пожалуйста, заполните все поля');
    }
  };

  return (
    <motion.div className="p-6 pt-20 min-h-screen bg-stone-50 flex flex-col items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate('/welcome')} className="mb-4 text-blue-600 font-semibold hover:text-blue-800">← Назад</button>
      <h2 className="text-2xl font-bold mb-6 text-stone-900">Регистрация администратора</h2>
      <input 
        type="email" 
        className="w-full p-3 mb-4 border rounded-xl" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        className="w-full p-3 mb-4 border rounded-xl" 
        placeholder="Пароль" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      {error && <p className="text-rose-600 mb-4">{error}</p>}
      <button 
        className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition-all" 
        onClick={handleRegister}
      >
        Зарегистрироваться
      </button>
    </motion.div>
  );
}
