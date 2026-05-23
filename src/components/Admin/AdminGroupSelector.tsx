import { useState } from 'react';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AdminGroupSelector = ({ 
  groups, 
  selectedGroups, 
  onToggleGroup, 
  viewMode,
  onViewModeChange
}: { 
  groups: string[];
  selectedGroups: Set<string>;
  onToggleGroup: (group: string) => void;
  viewMode: 'single' | 'multi';
  onViewModeChange: (mode: 'single' | 'multi') => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            View Mode
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onViewModeChange('single')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors",
                viewMode === 'single' 
                  ? 'bg-brand-blue text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <Eye size={16} />
              Single View
            </button>
            <button
              onClick={() => onViewModeChange('multi')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors",
                viewMode === 'multi' 
                  ? 'bg-brand-blue text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <Eye size={16} />
              Multi View ({selectedGroups.size})
            </button>
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Groups
          </label>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-semibold flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <span>
                {selectedGroups.size === 0 
                  ? 'Select groups...' 
                  : `${selectedGroups.size} selected`}
              </span>
              <ChevronDown 
                size={20} 
                className={cn("transition-transform", isOpen && "rotate-180")}
              />
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                {groups.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center">No groups available</div>
                ) : (
                  <div className="p-2">
                    {groups.map(group => (
                      <label 
                        key={group}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGroups.has(group)}
                          onChange={() => onToggleGroup(group)}
                          className="w-4 h-4 accent-brand-blue rounded cursor-pointer"
                        />
                        <span className="flex-1 font-semibold text-gray-700">{group}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
