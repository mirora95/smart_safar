import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(-1)} 
      className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
    >
      <ArrowLeft size={28} />
    </button>
  );
}
