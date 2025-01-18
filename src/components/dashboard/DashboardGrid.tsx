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
  return (
    <div className="container mx-auto px-8 lg:px-12 xl:px-16 mt-8 max-w-screen-xl">
      <div className="grid grid-cols-12 gap-4">
        {/* Tall vertical container on the left */}
        <div className="col-span-12 md:col-span-3 row-span-2">
          <NetworksCard />
        </div>

        {/* Shortcuts Container */}
        <div className="col-span-12 md:col-span-4">
          <ShortcutsContainer />
        </div>

        {/* Latest Activity Container */}
        <div className="col-span-12 md:col-span-5">
          <LatestActivityContainer />
        </div>

        {/* Bottom Schedule - spans across Progress Stats and Course Details */}
        <div className="col-span-12 md:col-span-9">
          <ScheduleView />
        </div>
      </div>
    </div>
  );
};

export default DashboardGrid;