import { ChevronDown, ArrowRight, Loader2, Mail, Lock, AlertCircle, CheckCircle2, Cloud, User, ShieldCheck, Globe, Database } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footer?: ReactNode;
  showLogo?: boolean;
}

export const AuthLayout = ({ children, title, subtitle, footer }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans selection:bg-blue-50">
      {/* Left Column: Fixed Branding */}
      <div className="w-full md:w-[40%] bg-slate-50/50 p-8 md:p-16 flex flex-col border-r border-slate-100">
        <div className="flex flex-col items-start gap-12">
          {/* Logo Top Left */}
          <img 
            src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" 
            alt="SDP Suite Logo" 
            className="w-32 h-32 object-contain" 
          />
          
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Strategic Suite Access
            </h1>
            <div className="h-1 w-12 bg-blue-600 rounded-full" />
          </div>
        </div>
        
        <div className="mt-auto pt-12">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
            Strategic Excellence v2.0
          </p>
        </div>
      </div>

      {/* Right Column: Interaction Flow */}
      <div className="flex-1 flex flex-col p-8 md:p-16 md:justify-center">
        <div className="max-w-[480px] w-full mx-auto space-y-12">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">
              {title}
            </h2>
            <p className="text-sm text-slate-400 font-medium">
              {subtitle}
            </p>
          </div>

          <div className="w-full">
            {children}
          </div>

          {footer && (
            <div className="pt-8 border-t border-slate-50 flex items-center gap-8">
              {footer}
            </div>
          )}
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
    <div className="space-y-2 mb-4">
      <label className="block text-[10px] font-black text-slate-900 uppercase tracking-[0.1em] pl-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={cn(
            "w-full bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm font-bold outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50",
            icon ? "pl-12 pr-4 py-4" : "px-4 py-4"
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
    <div className="space-y-2 mb-4">
      <label className="block text-[10px] font-black text-slate-900 uppercase tracking-[0.1em] pl-1">
        {label}
      </label>
      <div className="relative">
        <select
          {...props}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm font-bold outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 appearance-none px-4 py-4 cursor-pointer"
        >
          {children}
        </select>
        <ChevronDown 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" 
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
    primary: "bg-slate-900 text-white hover:bg-black",
    secondary: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent text-slate-400 hover:text-blue-600",
    outline: "bg-white border border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all"
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        "w-full py-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-[0.1em]",
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

export const ModeCard = ({ 
  title, 
  description, 
  icon, 
  onClick
}: { 
  title: string; 
  description: string; 
  icon: ReactNode; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-5 p-5 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50/50 hover:border-slate-200 transition-all text-left group"
  >
    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="text-sm font-black text-slate-900 tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-slate-400 font-medium leading-tight">
        {description}
      </p>
    </div>
    <ArrowRight className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={16} />
  </button>
);

export const AuthMessage = ({ type, children }: { type: 'error' | 'success', children: ReactNode }) => {
  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-xl text-xs font-bold border",
      type === 'error' ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"
    )}>
      {type === 'error' ? <AlertCircle size={16} className="shrink-0" /> : <CheckCircle2 size={16} className="shrink-0" />}
      <span className="leading-tight">{children}</span>
    </div>
  );
};

export { Mail, Lock, Cloud, User, ShieldCheck, ArrowRight, Globe, Database };
