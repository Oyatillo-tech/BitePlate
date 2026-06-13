import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import ErrorAlert from '../../components/common/ErrorAlert';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'WAITER', phone: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-3xl">🍽️</span>
          <h1 className="text-2xl font-semibold text-primary mt-3">Register Staff</h1>
        </div>

        <div className="card">
          <ErrorAlert message={error} onClose={() => setError('')} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">Full Name</label>
              <input name="name" value={formData.name} onChange={handleChange} className="input" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input" required minLength={6} />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">Phone</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="input">
                <option value="WAITER">Waiter</option>
                <option value="CHEF">Chef</option>
                <option value="CASHIER">Cashier</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              <UserPlus size={16} />
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-xs text-secondary mt-6">
            <Link to="/login" className="text-accent hover:underline">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
