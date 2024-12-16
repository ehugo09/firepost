import { useState } from 'react';
import NetworksCard from './NetworksCard';
import MessagesCard from './MessagesCard';
import AudienceCard from './AudienceCard';
import EngagementChart from './EngagementChart';
import ScheduleTimeline from './ScheduleTimeline';

interface DashboardGridProps {
  chartData: Array<{ name: string; value: number }>;
  networks: Array<{ name: string; icon: string; lessons: number; hours: number }>;
}

const DashboardGrid = ({ chartData, networks }: DashboardGridProps) => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 pt-24">
      <div className="grid grid-cols-12 gap-4">
        {/* Left column - tall box */}
        <div className="col-span-12 md:col-span-3 space-y-4">
          <NetworksCard networks={networks} />
        </div>

        {/* Middle column - two boxes stacked */}
        <div className="col-span-12 md:col-span-9 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <MessagesCard />
            <AudienceCard />
          </div>
          <div className="grid grid-cols-1">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <EngagementChart chartData={chartData} />
              </div>
              <div className="w-1/2">
                <ScheduleTimeline />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGrid;