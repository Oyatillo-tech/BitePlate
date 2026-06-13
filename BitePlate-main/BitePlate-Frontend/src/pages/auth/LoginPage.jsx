import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ErrorAlert from '../../components/common/ErrorAlert';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: 'alice@biteplate.com',
    password: 'password123',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl">🍽️</span>
          <h1 className="text-2xl font-semibold text-primary mt-3 tracking-tight">BitePlate</h1>
          <p className="text-sm text-secondary mt-1">Restaurant Management</p>
        </div>

        <div className="card">
          <ErrorAlert message={error} onClose={() => setError('')} />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1.5">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              <LogIn size={16} />
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-xs text-secondary mt-6">
            Demo: alice@biteplate.com / password123
            <br />
            <Link to="/register" className="text-accent hover:underline mt-2 inline-block">
              Register staff
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
