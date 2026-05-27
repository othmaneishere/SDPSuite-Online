import { ChevronDown, ArrowRight, Loader2, Mail, Lock, AlertCircle, CheckCircle2, Cloud, User, ShieldCheck } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footer?: ReactNode;
  showLogo?: boolean;
}

export const AuthLayout = ({ children, title, subtitle, footer, showLogo = true }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans selection:bg-blue-50 overflow-x-hidden">
      {/* Left Side: Large Branding */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 bg-slate-50/50 border-r border-slate-100">
        <div className="max-w-md w-full space-y-12 animate-in fade-in slide-in-from-left-6 duration-700">
          {showLogo && (
            <div className="space-y-8">
              <img 
                src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" 
                alt="SDP Suite Logo" 
                className="w-48 h-48 md:w-64 md:h-64 object-contain" 
              />
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-none">
                  SDP<span className="text-blue-600">Suite</span>
                </h1>
                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.4em]">Strategic Excellence</p>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
              {title}
            </h2>
            <p className="text-lg text-slate-400 font-medium">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Simple Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 bg-white relative">
        <div className="max-w-[440px] w-full animate-in fade-in slide-in-from-right-6 duration-700 delay-100">
          {children}

          {footer && (
            <div className="mt-16 pt-8 border-t border-slate-50 flex flex-wrap items-center gap-x-8 gap-y-4 animate-in fade-in duration-1000 delay-300">
              {footer}
            </div>
          )}
          
          <div className="mt-12 text-[9px] font-black text-slate-200 uppercase tracking-[0.3em]">
            Enterprise Edition v2.0
          </div>
        </div>
      </div>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

export const AuthInput = ({ label, icon, ...props }: InputProps) => {
  return (
    <div className="space-y-3 mb-6">
      <label className="block text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] pl-1">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={cn(
            "w-full bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-800 text-lg font-bold outline-none transition-all focus:bg-white focus:border-blue-600 shadow-sm",
            icon ? "pl-16 pr-8 py-5" : "px-8 py-5"
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
    <div className="space-y-3 mb-6">
      <label className="block text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] pl-1">
        {label}
      </label>
      <div className="relative group">
        <select
          {...props}
          className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-800 text-lg font-bold outline-none transition-all focus:bg-white focus:border-blue-600 shadow-sm appearance-none px-8 py-5 cursor-pointer"
        >
          {children}
        </select>
        <ChevronDown 
          className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-slate-600 transition-colors pointer-events-none" 
          size={24} 
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
    primary: "bg-slate-900 text-white hover:bg-black",
    secondary: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent text-slate-400 hover:text-blue-600",
    outline: "bg-white border-2 border-slate-100 text-slate-500 hover:border-slate-900 hover:text-slate-900 transition-all"
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        "w-full py-5 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-[0.2em]",
        variants[variant],
        className
      )}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          {children}
          {icon}
        </>
      )}
    </button>
  );
};

export const AuthMessage = ({ type, children }: { type: 'error' | 'success', children: ReactNode }) => {
  return (
    <div className={cn(
      "flex items-center gap-4 p-5 rounded-2xl text-sm font-bold border-2",
      type === 'error' ? "bg-red-50 text-red-600 border-red-50" : "bg-green-50 text-green-600 border-green-50"
    )}>
      {type === 'error' ? <AlertCircle size={20} className="shrink-0" /> : <CheckCircle2 size={20} className="shrink-0" />}
      <span className="leading-tight">{children}</span>
    </div>
  );
};

export { Mail, Lock, Cloud, User, ShieldCheck, ArrowRight };
