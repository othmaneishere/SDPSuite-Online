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

export const AuthLayout = ({
  children,
  title,
  subtitle,
  footer,
  centerHeader = false,
}: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans selection:bg-blue-50 lg:flex-row">
      {/* Left Column: Fixed Branding */}
      <div className="flex w-full flex-col justify-center border-b border-slate-100 bg-slate-50/50 p-8 md:p-16 lg:w-[45%] lg:border-r lg:border-b-0 lg:p-24">
        <div className="animate-in fade-in slide-in-from-left-4 flex flex-col items-start gap-12 duration-1000 lg:gap-20">
          <img
            src="https://i.ibb.co/WWxYzvmx/pbs-logo.png"
            alt="SDP Suite Logo"
            className="h-56 w-56 object-contain md:h-72 md:w-72"
          />

          <div className="space-y-6">
            <h1 className="text-4xl leading-[1.1] font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Strategic Suite <br /> Access
            </h1>
            <div className="h-2 w-20 rounded-full bg-blue-600" />
          </div>
        </div>

        <div className="mt-16 opacity-60 lg:mt-32">
          <p className="text-[10px] font-black tracking-widest text-slate-900 uppercase">
            © Africa Campus – École des Ponts Business School
          </p>
        </div>
      </div>

      {/* Right Column: Interaction Flow */}
      <div className="flex flex-1 flex-col justify-center bg-white p-8 md:p-16 lg:p-24">
        <div className="animate-in fade-in slide-in-from-right-4 mx-auto w-full max-w-[440px] space-y-12 delay-200 duration-1000">
          <div className={cn('space-y-4', centerHeader ? 'text-center' : 'text-left')}>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase md:text-4xl">
              {title}
            </h2>
            <p className="text-lg leading-relaxed font-medium text-slate-400">{subtitle}</p>
          </div>

          <div className="w-full">{children}</div>

          {footer && (
            <div className="flex w-full items-center justify-between border-t border-slate-100 pt-10">
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
    <div className="mb-6 space-y-3">
      <label className="block pl-1 text-[11px] font-black tracking-[0.2em] text-slate-900 uppercase">
        {label}
      </label>
      <div className="group relative">
        {icon && (
          <div className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-blue-600">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={cn(
            'w-full rounded-2xl border border-slate-200 bg-slate-50 text-base font-bold text-slate-800 transition-all outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50/50',
            icon ? 'py-5 pr-4 pl-12' : 'px-4 py-5',
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
    <div className="mb-8 space-y-3">
      <label className="block pl-1 text-[11px] font-black tracking-[0.2em] text-slate-900 uppercase">
        {label}
      </label>
      <div className="group relative">
        <select
          {...props}
          className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-base font-bold text-slate-800 transition-all outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50/50"
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-slate-300 transition-colors group-hover:text-slate-600"
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

export const AuthButton = ({
  variant = 'primary',
  icon,
  loading,
  children,
  className,
  ...props
}: ButtonProps) => {
  const variants = {
    primary:
      'bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200 hover:shadow-slate-300',
    secondary:
      'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100 hover:shadow-blue-200',
    ghost: 'bg-transparent text-slate-400 hover:text-blue-600',
    outline:
      'bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm',
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        'flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl py-5 text-xs font-black tracking-[0.2em] uppercase transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
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
