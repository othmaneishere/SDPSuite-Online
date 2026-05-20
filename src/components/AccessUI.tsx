import React, { useState, FormEvent } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

// Unified Corporate Branding Logo
const Logo = () => (
  <div className="flex flex-col items-center gap-2 mb-6">
    <img 
      src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" 
      alt="SDP Suite Logo" 
      className="w-24 h-24 object-contain" 
    />
    <h1 className="text-3xl font-black tracking-tight text-slate-900">
      SDP<span className="text-brand-blue font-bold">Suite</span>
    </h1>
  </div>
);

export const AccessCard = ({ 
  title, 
  description, 
  children 
}: { 
  title: string; 
  description: string; 
  children: React.ReactNode; 
}) => (
  <div className="w-full max-w-md bg-white p-10 rounded-[32px] shadow-xl border border-slate-100/80 hover:shadow-2xl transition-all duration-300">
    <Logo />
    <div className="text-center mb-8">
      <h2 className="text-xl font-bold tracking-tight text-slate-800">{title}</h2>
      <p className="text-slate-400 text-xs mt-2 leading-relaxed">{description}</p>
    </div>
    {children}
  </div>
);

export const AccessScreen = ({ 
  onAccess 
}: { 
  onAccess: (group: string) => void; 
}) => {
  const [selectedGroup, setSelectedGroup] = useState('Group 1');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAccess(selectedGroup);
  };

  const groups = Array.from({ length: 11 }, (_, i) => `Group ${i + 1}`);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <AccessCard 
        title="Strategic Suite Access" 
        description="Select your group to proceed to your team's workspace."
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-left pl-1">
              Your Group
            </label>
            <div className="relative">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-6 py-4 border border-slate-200 rounded-2xl text-slate-700 text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30 transition-all appearance-none cursor-pointer bg-white font-semibold shadow-xs"
              >
                {groups.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <ChevronDown 
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" 
                size={16} 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform duration-150 cursor-pointer"
          >
            Get Started <ArrowRight size={16} />
          </button>
        </form>
        
        <div className="text-center pt-8 border-t border-slate-100 mt-8">
          <a 
            href="/professor-dashboard" 
            className="text-[10px] font-black text-slate-400 hover:text-brand-blue uppercase tracking-widest transition-colors duration-150"
          >
            Faculty Admin
          </a>
        </div>
      </AccessCard>
    </div>
  );
};
