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
        setSuccess('Account activation link sent to your email.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={isLogin ? "Cloud Workspace" : "Create Account"}
      subtitle={isLogin ? "Sign in to access your dashboard." : "Join the strategic development suite."}
      footer={
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
      }
    >
      <form onSubmit={handleAuth} className="space-y-8">
        <div className="space-y-1">
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AuthMessage type="error">{error}</AuthMessage>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AuthMessage type="success">{success}</AuthMessage>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <AuthButton
            type="submit"
            loading={loading}
            variant="primary"
            icon={<ArrowRight size={20} />}
          >
            {isLogin ? 'Enter Portal' : 'Register'}
          </AuthButton>
          
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
