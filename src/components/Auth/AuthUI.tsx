import { ChevronDown, ArrowRight, Loader2, User, ShieldCheck } from 'lucide-react';
import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footer?: ReactNode;
}

export const AuthLayout = ({ children, title, subtitle, footer }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 selection:bg-blue-50 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[480px]"
      >
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          {/* Logo Section */}
          <div className="pt-12 pb-4 flex justify-center">
            <img 
              src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" 
              alt="SDP Suite Logo" 
              className="w-32 h-32 object-contain" 
            />
          </div>

          <div className="px-8 md:px-12 pb-12">
            <div className="text-center space-y-3 mb-10">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
                {title}
              </h1>
              <p className="text-sm text-slate-400 font-medium tracking-wide">
                {subtitle}
              </p>
              <div className="h-1.5 w-12 bg-blue-600 rounded-full mx-auto mt-4" />
            </div>

            <div className="w-full">
              {children}
            </div>

            {footer && (
              <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center gap-10">
                {footer}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center opacity-30">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
            Strategic Excellence v2.0
          </p>
        </div>
      </motion.div>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

export const AuthInput = ({ label, icon, ...props }: InputProps) => {
  return (
    <div className="space-y-2.5 mb-5">
      <label className="block text-[10px] font-black text-slate-900 uppercase tracking-[0.15em] pl-1">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={cn(
            "w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-bold outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50",
            icon ? "pl-12 pr-4 py-4.5" : "px-4 py-4.5"
          )}
        />
      </div>
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export const AuthSelect = ({ label, children, ...props }: SelectProps) => {
  return (
    <div className="space-y-2.5 mb-5">
      <label className="block text-[10px] font-black text-slate-900 uppercase tracking-[0.15em] pl-1">
        {label}
      </label>
      <div className="relative group">
        <select
          {...props}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-bold outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 appearance-none px-4 py-4.5 cursor-pointer"
        >
          {children}
        </select>
        <ChevronDown 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-slate-600 transition-colors pointer-events-none" 
          size={18} 
        />
      </div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  icon?: ReactNode;
  loading?: boolean;
}

export const AuthButton = ({ variant = 'primary', icon, loading, children, className, ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200",
    secondary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100",
    ghost: "bg-transparent text-slate-400 hover:text-blue-600",
    outline: "bg-white border border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm"
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        "w-full py-4.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-[0.15em]",
        variants[variant],
        className
      )}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        <>
          {children}
          {icon}
        </>
      )}
    </button>
  );
};

export { User, ShieldCheck, ArrowRight };
