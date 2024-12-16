import ProgressStats from './ProgressStats';
import CourseDetails from './CourseDetails';
import ScheduleView from './ScheduleView';
import NetworksCard from './NetworksCard';
import ShortcutsContainer from './ShortcutsContainer';
import LatestActivityContainer from './LatestActivityContainer';

interface DashboardGridProps {
  progressData: Array<{ label: string; value: number; color: string }>;
}

const DashboardGrid = ({ progressData }: DashboardGridProps) => {
  const networks = [
    { name: 'Instagram', icon: '/instagram.png', lessons: 12, hours: 24 },
    { name: 'Twitter', icon: '/twitter.png', lessons: 8, hours: 16 },
    { name: 'LinkedIn', icon: '/linkedin.png', lessons: 6, hours: 12 },
  ];

  return (
    <div className="max-w-[800px] mx-auto px-2 mt-8">
      <div className="grid grid-cols-12 gap-1">
        {/* Tall vertical container on the left */}
        <div className="col-span-3 row-span-2">
          <NetworksCard networks={networks} />
        </div>

        {/* Shortcuts Container */}
        <div className="col-span-4">
          <ShortcutsContainer />
        </div>

        {/* Latest Activity Container */}
        <div className="col-span-5">
          <LatestActivityContainer />
        </div>

        {/* Bottom Schedule - spans across Progress Stats and Course Details */}
        <div className="col-span-9">
          <ScheduleView />
        </div>
      </div>
    </div>
  );
};

export default DashboardGrid;