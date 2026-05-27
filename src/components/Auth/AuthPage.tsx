import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AuthLayout, 
  AuthInput, 
  AuthButton, 
  AuthMessage, 
  Mail, 
  Lock, 
  ArrowRight,
  User
} from './AuthUI';

export const AuthPage = ({ onGuestMode }: { onGuestMode: () => void }) => {
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
        setSuccess('Account activation initiated. Check your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification sequence failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={isLogin ? "Cloud Workspace" : "Create Account"}
      subtitle={isLogin ? "Access your high-performance collaborative environment." : "Join the strategic development network."}
      footer={
        <div className="flex items-center gap-12">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccess(null);
            }}
            className="text-[11px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] transition-colors cursor-pointer"
          >
            {isLogin ? "Request Access" : "Existing User"}
          </button>
        </div>
      }
    >
      <form onSubmit={handleAuth} className="space-y-10">
        <div className="space-y-6">
          <AuthInput
            label="Corporate Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
            icon={<Mail size={22} />}
          />

          <AuthInput
            label="Security Key"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            icon={<Lock size={22} />}
          />
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AuthMessage type="error">{error}</AuthMessage>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AuthMessage type="success">{success}</AuthMessage>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <AuthButton
            type="submit"
            loading={loading}
            variant="primary"
            icon={<ArrowRight size={20} />}
          >
            {isLogin ? 'Enter Portal' : 'Register'}
          </AuthButton>
          
          <div className="relative flex items-center justify-center py-2">
            <span className="absolute inset-x-0 h-px bg-slate-100"></span>
            <span className="relative bg-white md:bg-transparent px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Alternate Access</span>
          </div>

          <AuthButton
            type="button"
            onClick={onGuestMode}
            variant="outline"
            icon={<User size={20} />}
          >
            Local Session
          </AuthButton>
        </div>
      </form>
    </AuthLayout>
  );
};
