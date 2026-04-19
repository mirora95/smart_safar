import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

interface User { id: string; email: string; role: string; }
interface AccessRequest { id: string; email: string; }

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    const storedRequests = localStorage.getItem('accessRequests');
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedRequests) setRequests(JSON.parse(storedRequests));
  }, []);

  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const saveRequests = (updatedRequests: AccessRequest[]) => {
    setRequests(updatedRequests);
    localStorage.setItem('accessRequests', JSON.stringify(updatedRequests));
  };

  const addUser = () => {
    if (!newEmail) return;
    const newUser = { id: Date.now().toString(), email: newEmail, role: 'user' };
    saveUsers([...users, newUser]);
    setNewEmail('');
  };

  const removeUser = (id: string) => {
    saveUsers(users.filter(u => u.id !== id));
  };

  const approveRequest = (id: string) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      saveUsers([...users, { id: Date.now().toString(), email: request.email, role: 'user' }]);
      saveRequests(requests.filter(r => r.id !== id));
    }
  };

  const denyRequest = (id: string) => {
    saveRequests(requests.filter(r => r.id !== id));
  };

  return (
    <motion.div className="min-h-screen bg-stone-50 p-6 pt-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate('/welcome')} className="mb-6 text-blue-600 font-semibold hover:text-blue-800">← {t('back')}</button>
      <h2 className="text-3xl font-extrabold text-stone-900 mb-8">{t('adminPanel')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
          <h3 className="text-xl font-bold mb-4">{t('users')}</h3>
          <div className="flex gap-2 mb-4">
            <input className="flex-1 p-3 border border-stone-200 rounded-xl" placeholder={t('newEmailPlaceholder')} value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            <button className="p-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700" onClick={addUser}>{t('addUser')}</button>
          </div>
          <ul className="space-y-2">
            {users.map(u => (
              <li key={u.id} className="flex justify-between items-center p-3 bg-stone-100 rounded-xl">
                <span>{u.email} ({u.role})</span>
                <button className="text-rose-600 font-semibold hover:text-rose-800" onClick={() => removeUser(u.id)}>{t('remove')}</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
          <h3 className="text-xl font-bold mb-4">{t('accessRequests')}</h3>
          <ul className="space-y-2">
            {requests.map(r => (
              <li key={r.id} className="flex justify-between items-center p-3 bg-stone-100 rounded-xl">
                <span>{r.email}</span>
                <div className="flex gap-2">
                  <button className="text-blue-600 font-semibold hover:text-blue-800" onClick={() => approveRequest(r.id)}>{t('approve')}</button>
                  <button className="text-rose-600 font-semibold hover:text-rose-800" onClick={() => denyRequest(r.id)}>{t('deny')}</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
