import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AdminGroupSelector = ({
  groups,
  selectedGroups,
  onToggleGroup,
}: {
  groups: string[];
  selectedGroups: Set<string>;
  onToggleGroup: (group: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-semibold text-gray-700">Groups</label>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              <span>
                {selectedGroups.size === 0 ? 'Select groups...' : `${selectedGroups.size} selected`}
              </span>
              <ChevronDown
                size={20}
                className={cn('transition-transform', isOpen && 'rotate-180')}
              />
            </button>

            {isOpen && (
              <div className="absolute top-full right-0 left-0 z-10 mt-2 max-h-64 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                {groups.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No groups available</div>
                ) : (
                  <div className="p-2">
                    {groups.map((group) => (
                      <label
                        key={group}
                        className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGroups.has(group)}
                          onChange={() => onToggleGroup(group)}
                          className="accent-brand-blue h-4 w-4 cursor-pointer rounded"
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
