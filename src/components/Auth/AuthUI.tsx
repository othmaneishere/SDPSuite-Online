import { ChevronDown, ArrowRight, Loader2, User, ShieldCheck } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footer?: ReactNode;
  centerHeader?: boolean;
}

export const AuthLayout = ({ children, title, subtitle, footer, centerHeader = false }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans selection:bg-blue-50">
      {/* Left Column: Fixed Branding */}
      <div className="w-full lg:w-[45%] bg-slate-50/50 p-8 md:p-16 lg:p-24 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-100 justify-center">
        <div className="flex flex-col items-start gap-12 lg:gap-20 animate-in fade-in slide-in-from-left-4 duration-1000">
          <img 
            src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" 
            alt="SDP Suite Logo" 
            className="w-32 h-32 md:w-44 md:h-44 object-contain" 
          />
          
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Strategic Suite <br /> Access
            </h1>
            <div className="h-2 w-20 bg-blue-600 rounded-full" />
            <p className="text-slate-500 font-medium text-lg max-w-sm leading-relaxed">
              Empowering professional strategic development through collaborative frameworks.
            </p>
          </div>
        </div>
        
        <div className="mt-16 lg:mt-32 opacity-30">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
            Strategic Excellence v2.0
          </p>
        </div>
      </div>

      {/* Right Column: Interaction Flow */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-white">
        <div className="max-w-[440px] w-full mx-auto space-y-12 animate-in fade-in slide-in-from-right-4 duration-1000 delay-200">
          <div className={cn("space-y-4", centerHeader ? "text-center" : "text-left")}>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase italic">
              {title}
            </h2>
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="w-full">
            {children}
          </div>

          {footer && (
            <div className="pt-10 border-t border-slate-100 flex items-center justify-between w-full">
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
    <div className="space-y-3 mb-6">
      <label className="block text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] pl-1">
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
            "w-full bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-base font-bold outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50",
            icon ? "pl-12 pr-4 py-5" : "px-4 py-5"
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
    <div className="space-y-3 mb-8">
      <label className="block text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] pl-1">
        {label}
      </label>
      <div className="relative group">
        <select
          {...props}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-base font-bold outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50/50 appearance-none px-4 py-5 cursor-pointer"
        >
          {children}
        </select>
        <ChevronDown 
          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-slate-600 transition-colors pointer-events-none" 
          size={20} 
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
    primary: "bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200 hover:shadow-slate-300",
    secondary: "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100 hover:shadow-blue-200",
    ghost: "bg-transparent text-slate-400 hover:text-blue-600",
    outline: "bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm"
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        "w-full py-5 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-[0.2em]",
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

export { User, ShieldCheck, ArrowRight };
