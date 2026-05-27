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
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden selection:bg-blue-50">
      {/* Immersive background decoration */}
      <div className="fixed top-0 right-0 w-[60vw] h-[60vw] bg-blue-50/30 rounded-full -mr-[20vw] -mt-[20vw] blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[40vw] h-[40vw] bg-indigo-50/20 rounded-full -ml-[10vw] -mb-[10vw] blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 flex-1 flex flex-col max-w-[1400px] mx-auto w-full px-8 md:px-20 py-12 md:py-24">
        {/* Top Branding Section */}
        {showLogo && (
          <div className="flex items-center gap-4 mb-24 animate-in fade-in slide-in-from-top-4 duration-700">
            <img 
              src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" 
              alt="SDP Suite Logo" 
              className="w-16 h-16 object-contain" 
            />
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                SDP<span className="text-blue-600">Suite</span>
              </h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Strategic Excellence</p>
            </div>
          </div>
        )}

        {/* Main Content Area - Split Layout Style */}
        <div className="flex-1 flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                {title.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h2>
              <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-md leading-relaxed">
                {subtitle}
              </p>
            </div>
            
            <div className="hidden md:block pt-12">
               <div className="flex items-center gap-4">
                 <div className="flex -space-x-3">
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                       <User size={16} className="text-slate-400" />
                     </div>
                   ))}
                 </div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Collaborative Strategy Engine</p>
               </div>
            </div>
          </div>

          <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="bg-white/40 backdrop-blur-xl p-2 md:p-8 rounded-[48px]">
              {children}
            </div>
          </div>
        </div>

        {/* Bottom Navigation / Footer */}
        {footer && (
          <div className="mt-24 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in duration-1000 delay-500">
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Enterprise Edition v2.0
            </div>
            <div>
              {footer}
            </div>
          </div>
        )}
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
    <div className="space-y-3">
      <label className="block text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] pl-6">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={cn(
            "w-full bg-white border-2 border-slate-100 rounded-[32px] text-slate-800 text-lg font-bold outline-none transition-all focus:border-blue-600 focus:ring-8 focus:ring-blue-50/50 shadow-sm",
            icon ? "pl-16 pr-8 py-6" : "px-8 py-6"
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
    <div className="space-y-3">
      <label className="block text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] pl-6">
        {label}
      </label>
      <div className="relative group">
        <select
          {...props}
          className="w-full bg-white border-2 border-slate-100 rounded-[32px] text-slate-800 text-lg font-bold outline-none transition-all focus:border-blue-600 focus:ring-8 focus:ring-blue-50/50 shadow-sm appearance-none px-8 py-6 cursor-pointer"
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
    primary: "bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-100",
    secondary: "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-50",
    ghost: "bg-transparent text-slate-400 hover:text-blue-600",
    outline: "bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all"
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        "w-full py-6 rounded-[32px] text-sm font-black transition-all flex items-center justify-center gap-3 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-[0.2em]",
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
      "flex items-center gap-4 p-6 rounded-[28px] text-sm font-bold border-2 animate-in fade-in zoom-in-95 duration-300",
      type === 'error' ? "bg-red-50/50 text-red-600 border-red-100" : "bg-green-50/50 text-green-600 border-green-100"
    )}>
      {type === 'error' ? <AlertCircle size={20} className="shrink-0" /> : <CheckCircle2 size={20} className="shrink-0" />}
      <span className="leading-tight">{children}</span>
    </div>
  );
};

export { Mail, Lock, Cloud, User, ShieldCheck, ArrowRight };
