import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  return (
    <motion.div 
      className="flex h-screen flex-col items-center justify-center bg-blue-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="mb-6 text-2xl font-bold text-blue-900">Forgot Password</h2>
      <p className="mb-6 text-gray-600 text-center">Enter your email or phone number to reset your password.</p>
      <input type="text" placeholder="Phone or Email" className="mb-4 w-full max-w-md rounded-lg border p-3" />
      <Link to="/login" className="w-full block text-center rounded-lg bg-blue-600 py-3 text-white font-semibold">Reset Password</Link>
      <Link to="/login" className="mt-4 text-blue-600">Back to Login</Link>
    </motion.div>
  );
}
