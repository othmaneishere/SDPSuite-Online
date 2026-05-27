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
        setSuccess('Cloud account initiated. Please check your email for verification.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication sequence failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={isLogin ? "Cloud Portal" : "Join the Cloud"}
      subtitle={isLogin ? "Access your collaborative strategy workspace" : "Create an enterprise account to begin"}
      footer={
        <div className="space-y-4">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccess(null);
            }}
            className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors cursor-pointer"
          >
            {isLogin ? "Need cloud access? Request Account" : 'Return to Cloud Sign In'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleAuth} className="space-y-6">
        <AuthInput
          label="Enterprise Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          required
          icon={<Mail size={18} />}
        />

        <AuthInput
          label="Access Key"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          icon={<Lock size={18} />}
        />

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AuthMessage type="error">{error}</AuthMessage>
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AuthMessage type="success">{success}</AuthMessage>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-2 space-y-4">
          <AuthButton
            type="submit"
            loading={loading}
            variant="secondary"
            icon={<ArrowRight size={18} />}
          >
            {isLogin ? 'Enter Workspace' : 'Initialize Account'}
          </AuthButton>
          
          <div className="relative flex items-center justify-center py-2">
            <span className="absolute inset-x-0 h-px bg-slate-100"></span>
            <span className="relative bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">or</span>
          </div>

          <AuthButton
            type="button"
            onClick={onGuestMode}
            variant="outline"
            icon={<User size={18} />}
          >
            Local Workspace
          </AuthButton>
        </div>
      </form>
    </AuthLayout>
  );
};
