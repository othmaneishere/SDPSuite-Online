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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        {showLogo && (
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <img 
                src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" 
                alt="SDP Suite Logo" 
                className="relative w-24 h-24 object-contain" 
              />
            </div>
            <div className="mt-4 text-center">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                SDP<span className="text-blue-600">Suite</span>
              </h1>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <span className="h-px w-4 bg-slate-200"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Strategic Excellence</span>
                <span className="h-px w-4 bg-slate-200"></span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100/80 relative overflow-hidden">
          {/* Subtle background accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="relative">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">{title}</h2>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed font-medium">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>

        {footer && (
          <div className="mt-8 text-center animate-in fade-in duration-1000 delay-300">
            {footer}
          </div>
        )}
        
        <div className="mt-12 flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Edition v2.0</span>
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
    <div className="space-y-2.5">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] pl-1">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={cn(
            "w-full bg-slate-50/50 border border-slate-200 rounded-[20px] text-slate-700 text-sm font-semibold outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 shadow-sm",
            icon ? "pl-12 pr-6 py-4" : "px-6 py-4"
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
    <div className="space-y-2.5">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] pl-1">
        {label}
      </label>
      <div className="relative group">
        <select
          {...props}
          className="w-full bg-slate-50/50 border border-slate-200 rounded-[20px] text-slate-700 text-sm font-semibold outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 shadow-sm appearance-none px-6 py-4 cursor-pointer"
        >
          {children}
        </select>
        <ChevronDown 
          className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors pointer-events-none" 
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
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200",
    secondary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900",
    outline: "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        "w-full py-4 rounded-[20px] text-[13px] font-black transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider",
        variants[variant],
        className
      )}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
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
      "flex items-center gap-3 p-4 rounded-2xl text-[11px] font-bold border animate-in fade-in zoom-in-95 duration-300",
      type === 'error' ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"
    )}>
      {type === 'error' ? <AlertCircle size={16} className="shrink-0" /> : <CheckCircle2 size={16} className="shrink-0" />}
      <span className="leading-tight">{children}</span>
    </div>
  );
};

export { Mail, Lock, Cloud, User, ShieldCheck, ArrowRight };
