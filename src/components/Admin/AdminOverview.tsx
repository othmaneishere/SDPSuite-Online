import { GroupData, PESTELRow, VRIORow, TOWSRow, PorterRow } from '../../types';
import { cn } from '../../lib/utils';

export const AdminOverview = ({
  groups,
  groupsData,
  onSelectGroup,
}: {
  groups: string[];
  groupsData: Record<string, GroupData>;
  onSelectGroup: (group: string) => void;
}) => {
  const frameworks = [
    { key: 'pestel', label: 'PESTEL' },
    { key: 'mckinsey', label: 'McKinsey' },
    { key: 'vrio', label: 'VRIO' },
    { key: 'tows', label: 'TOWS' },
    { key: 'porters', label: 'PORTER' },
  ] as const;

  const getStatus = (group: string, framework: (typeof frameworks)[number]['key']) => {
    const data = groupsData[group];
    if (!data) return 'empty';

    const content = data[framework];
    if (!content) return 'empty';

    if (Array.isArray(content)) {
      if (content.length === 0) return 'empty';
      const rows = content as (PESTELRow | VRIORow | TOWSRow | PorterRow)[];
      const filled = rows.filter((item) => {
        if (framework === 'pestel') return (item as PESTELRow).description?.length > 10;
        if (framework === 'vrio') return (item as VRIORow).resource?.length > 2;
        if (framework === 'tows') return (item as TOWSRow).data?.some((d: string) => d.length > 0);
        if (framework === 'porters') {
          const p = item as PorterRow;
          return p.analysis?.length > 10 || Object.keys(p.scorecard || {}).length > 0;
        }
        return false;
      }).length;

      if (filled === 0) return 'empty';
      if (filled < rows.length / 2) return 'partial';
      return 'complete';
    } else {
      // McKinsey or Meta
      const obj = content as Record<string, unknown>;
      const keys = Object.keys(obj);
      if (keys.length === 0) return 'empty';
      const filled = keys.filter(k => {
          const val = obj[k];
          if (val && typeof val === 'object') return Object.keys(val).length > 0;
          return typeof val === 'string' && val.length > 0;
      }).length;
      if (filled === 0) return 'empty';
      return 'complete';
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50/50 p-6">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
          Cohort Progress Overview
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-left text-[10px] font-black tracking-widest text-gray-400 uppercase">
              <th className="p-6">Group</th>
              <th className="p-6">Company</th>
              {frameworks.map((f) => (
                <th key={f.key} className="p-6 text-center">
                  {f.label}
                </th>
              ))}
              <th className="p-6 text-center">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {groups.map((group) => {
              const data = groupsData[group];
              const participantsCount = data?.meta?.participants?.length || 0;
              const companyName = data?.meta?.companyName || '—';

              return (
                <tr key={group} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="p-6">
                    <button
                      onClick={() => onSelectGroup(group)}
                      className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {group}
                    </button>
                  </td>
                  <td className="p-6 text-sm font-medium text-gray-400">
                    {companyName}
                  </td>
                  {frameworks.map((f) => {
                    const status = getStatus(group, f.key);
                    return (
                      <td key={f.key} className="p-6">
                        <div className="flex justify-center">
                          <div
                            className={cn(
                              'h-3 w-3 rounded-full',
                              status === 'empty' && 'bg-gray-100',
                              status === 'partial' && 'bg-amber-400 animate-pulse',
                              status === 'complete' && 'bg-green-500',
                            )}
                            title={`${f.label}: ${status}`}
                          />
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-6">
                    <div className="flex justify-center">
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter",
                        participantsCount > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                      )}>
                        {participantsCount} Users
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-6 border-t border-gray-50 bg-gray-50/30 p-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" /> Complete
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-400" /> In Progress
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gray-100" /> Empty
          </div>
      </div>
    </div>
  );
};
