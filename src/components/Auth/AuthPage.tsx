import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          }
        });
        if (error) throw error;
        setSuccess('Check your email for the confirmation link!');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="flex justify-center mb-8">
            <img 
              src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" 
              alt="Logo" 
              className="h-24 w-auto object-contain"
              crossOrigin="anonymous"
            />
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 text-center mb-2 tracking-tight">
            Strategic Suite Access
          </h1>
          <p className="text-center text-gray-600 text-sm mb-8">
            {isLogin ? 'Sign in to access your dashboard' : 'Create an account to begin'}
          </p>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-tight text-gray-900 mb-3">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-tight text-gray-900 mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold border border-red-100"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-50 text-green-600 p-3 rounded-lg text-xs font-bold border border-green-100"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer uppercase tracking-tight"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" size={20} />
              ) : (
                isLogin ? 'Continue to Dashboard' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccess(null);
              }}
              className="text-xs font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors cursor-pointer"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-6 font-mono tracking-widest">
            SDP_ACCESS_V2.0
          </p>
        </div>
      </div>
    </div>
  );
};

