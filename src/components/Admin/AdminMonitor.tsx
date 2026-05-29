import { Activity, Clock } from 'lucide-react';
import { GroupData } from './AdminDashboard';
import { useMemo, useState, useEffect } from 'react';

export const AdminMonitor = ({
  selectedGroups,
  liveActivity,
  groupsData,
}: {
  selectedGroups: Set<string>;
  liveActivity: Map<string, { user: string; action: string; timestamp: number }>;
  groupsData: Record<string, GroupData>;
}) => {
  const [now, setNow] = useState(() => Date.now());

  // Update 'now' every minute to keep relative times fresh
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const activityItems = useMemo(() => {
    const items: Array<{ group: string; user: string; action: string; timestamp: number }> = [];

    liveActivity.forEach(({ user, action, timestamp }, key) => {
      const groupMatch = Array.from(selectedGroups).find((g) => key.includes(g));
      if (groupMatch) {
        items.push({ group: groupMatch, user, action, timestamp });
      }
    });

    // Add participant info from groups
    selectedGroups.forEach((group) => {
      const data = groupsData[group];
      if (data?.meta.participants) {
        data.meta.participants.forEach((participant) => {
          items.push({
            group,
            user: participant,
            action: 'Active participant',
            timestamp: Date.now(), // This is still technically slightly impure but much safer in useMemo
          });
        });
      }
    });

    return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  }, [selectedGroups, liveActivity, groupsData]);

  const formatTime = (timestamp: number, currentNow: number) => {
    const diff = currentNow - timestamp;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <Activity className="text-brand-blue" size={20} />
        <h3 className="text-lg font-bold text-gray-900">Live Activity</h3>
      </div>

      {activityItems.length === 0 ? (
        <div className="py-8 text-center">
          <Clock size={32} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="max-h-64 space-y-3 overflow-y-auto">
          {activityItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-b-0"
            >
              <div className="bg-brand-blue mt-2 h-2 w-2 flex-shrink-0 rounded-full"></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-semibold text-gray-900">{item.user}</span>
                    <span className="mx-2 text-sm text-gray-500">in</span>
                    <span className="text-brand-blue text-sm font-semibold">{item.group}</span>
                  </div>
                  <span className="text-xs whitespace-nowrap text-gray-400">
                    {formatTime(item.timestamp, now)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{item.action}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

