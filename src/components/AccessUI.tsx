import { useState, FormEvent } from 'react';
import { Users, ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

// Shared UI components
export const AccessCard = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
    <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
            <img src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" alt="SDP Suite Logo" className="w-20 h-20 mx-auto" />
            <h2 className="text-3xl font-light text-slate-900 tracking-tighter pt-4">SDP<span className="font-bold text-brand-blue">Suite</span></h2>
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            <p className="text-slate-500 font-medium text-sm">{description}</p>
        </div>
        {children}
    </div>
);

const AccessScreen = ({ onAccess }: { onAccess: (group: string, name: string) => void }) => {
  const [selectedGroup, setSelectedGroup] = useState('Group 1');
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter your name.");
    onAccess(selectedGroup, name);
  };

  const groups = Array.from({ length: 11 }, (_, i) => `Group ${i + 1}`);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
        <AccessCard title="Student Access" description="Verify your session details to enter your team's workspace.">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-6 py-4 border border-slate-200 rounded-full text-center text-sm outline-none focus:border-brand-blue transition-all"
                />
                <div className="relative">
                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="w-full px-6 py-4 border border-slate-200 rounded-full text-center text-sm outline-none focus:border-brand-blue transition-all appearance-none cursor-pointer"
                    >
                        {groups.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    Access Workspace <ArrowRight size={16}/>
                </button>
            </form>
            <div className="text-center pt-4">
                <a href="/professor-dashboard" className="text-[10px] text-slate-400 hover:text-slate-600 uppercase tracking-widest">Faculty Admin</a>
            </div>
        </AccessCard>
    </div>
  );
};
