import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Splash() {
  const navigate = useNavigate();
  const { user, isAuthReady } = useAuth();

  React.useEffect(() => {
    if (isAuthReady) {
      const timer = setTimeout(() => {
        if (user) {
          if (user.role === 'driver') {
            navigate('/driver-dashboard');
          } else if (user.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/map');
          }
        } else {
          navigate('/welcome');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [navigate, user, isAuthReady]);

  return (
    <motion.div 
      className="flex h-screen items-center justify-center bg-blue-600 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-4xl font-bold">Smart Safar</h1>
    </motion.div>
  );
}
