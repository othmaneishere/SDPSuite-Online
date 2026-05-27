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
  ModeCard,
  Globe,
  Database
} from './AuthUI';

export const AuthPage = ({ onGuestMode }: { onGuestMode: () => void }) => {
  const [view, setView] = useState<'selection' | 'login' | 'signup'>('selection');
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
      if (view === 'login') {
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
      title={view === 'selection' ? "Choose Workspace" : view === 'login' ? "Cloud Portal" : "Create Account"}
      subtitle={view === 'selection' ? "Select how you would like to manage your session." : "Enter your cloud credentials to continue."}
      footer={
        view !== 'selection' ? (
          <button
            onClick={() => {
              setView('selection');
              setError(null);
              setSuccess(null);
            }}
            className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] transition-colors cursor-pointer"
          >
            Back to Selection
          </button>
        ) : null
      }
    >
      <div className="w-full">
        <AnimatePresence mode="wait">
          {view === 'selection' ? (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <ModeCard 
                title="Cloud Workspace"
                description="Real-time collaboration and cloud backup."
                icon={<Globe size={24} />}
                onClick={() => setView('login')}
              />
              <ModeCard 
                title="Local Workspace"
                description="Private session with local browser storage."
                icon={<Database size={24} />}
                onClick={onGuestMode}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="auth-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-1">
                  <AuthInput
                    label="Corporate Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    icon={<Mail size={18} />}
                  />

                  <AuthInput
                    label="Security Key"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    icon={<Lock size={18} />}
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

                <div className="space-y-3">
                  <AuthButton
                    type="submit"
                    loading={loading}
                    variant="secondary"
                    icon={<ArrowRight size={18} />}
                  >
                    {view === 'login' ? 'Sign In' : 'Register'}
                  </AuthButton>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setView(view === 'login' ? 'signup' : 'login');
                      setError(null);
                      setSuccess(null);
                    }}
                    className="w-full text-[9px] font-black text-slate-300 hover:text-slate-600 uppercase tracking-[0.2em] transition-colors"
                  >
                    {view === 'login' ? "Need an account? Sign Up" : "Have an account? Sign In"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthLayout>
  );
};
