import { useState } from 'react';
import NetworksCard from './NetworksCard';
import MessagesCard from './MessagesCard';
import AudienceCard from './AudienceCard';
import ScheduledCard from './ScheduledCard';
import EngagementChart from './EngagementChart';
import RecentActivity from './RecentActivity';
import ScheduleTimeline from './ScheduleTimeline';

interface DashboardGridProps {
  chartData: Array<{ name: string; value: number }>;
  networks: Array<{ name: string; icon: string; lessons: number; hours: number }>;
}

const DashboardGrid = ({ chartData, networks }: DashboardGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <NetworksCard networks={networks} />
      <MessagesCard />
      <AudienceCard />
      <ScheduledCard />
      <EngagementChart chartData={chartData} />
      <RecentActivity />
      <ScheduleTimeline />
    </div>
  );
};

export default DashboardGrid;