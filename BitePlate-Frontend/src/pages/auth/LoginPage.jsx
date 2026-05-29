import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
        <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
            <div className="card p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-4xl">🍽️</span>
                        <h1 className="text-3xl font-bold text-primary">BitePlate</h1>
                    </div>
                    <p className="text-gray-600">Restaurant Management System</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border-2 border-danger rounded-lg p-4 mb-6">
                        <p className="text-danger font-semibold">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full flex items-center justify-center gap-2 font-semibold"
                    >
                        <LogIn size={20} />
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-gray-600 mt-6">
                    Demo credentials:
                    <br />
                    <span className="text-sm font-mono">alice@biteplate.com / password123</span>
                </p>
            </div>
        </div>
    );
}