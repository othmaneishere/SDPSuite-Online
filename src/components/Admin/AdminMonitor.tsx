import { Activity, Clock } from 'lucide-react';
import { GroupData } from './AdminDashboard';

export const AdminMonitor = ({ 
  selectedGroups, 
  liveActivity,
  groupsData
}: { 
  selectedGroups: Set<string>;
  liveActivity: Map<string, { user: string; action: string; timestamp: number }>;
  groupsData: Record<string, GroupData>;
}) => {
  const getActivityFeedItems = () => {
    const items: Array<{ group: string; user: string; action: string; timestamp: number }> = [];

    liveActivity.forEach(({ user, action, timestamp }, key) => {
      const groupMatch = Array.from(selectedGroups).find(g => key.includes(g));
      if (groupMatch) {
        items.push({ group: groupMatch, user, action, timestamp });
      }
    });

    // Add participant info from groups
    selectedGroups.forEach(group => {
      const data = groupsData[group];
      if (data?.meta.participants) {
        data.meta.participants.forEach(participant => {
          items.push({
            group,
            user: participant,
            action: 'Active participant',
            timestamp: Date.now()
          });
        });
      }
    });

    return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const activityItems = getActivityFeedItems();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="text-brand-blue" size={20} />
        <h3 className="text-lg font-bold text-gray-900">Live Activity</h3>
      </div>

      {activityItems.length === 0 ? (
        <div className="text-center py-8">
          <Clock size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500 text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {activityItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-b-0">
              <div className="w-2 h-2 rounded-full bg-brand-blue mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-gray-900 text-sm">{item.user}</span>
                    <span className="text-gray-500 text-sm mx-2">in</span>
                    <span className="font-semibold text-brand-blue text-sm">{item.group}</span>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{formatTime(item.timestamp)}</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{item.action}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
