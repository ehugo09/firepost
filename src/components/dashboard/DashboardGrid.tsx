import ProgressStats from './ProgressStats';
import CourseDetails from './CourseDetails';
import ScheduleView from './ScheduleView';
import NetworksCard from './NetworksCard';

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
    <div className="max-w-[800px] mx-auto px-2 mt-16"> {/* Matched width with TopNavigation */}
      <div className="grid grid-cols-12 gap-2"> {/* Reduced gap for more compact layout */}
        {/* Tall vertical container on the left */}
        <div className="col-span-3 row-span-2">
          <NetworksCard networks={networks} />
        </div>

        {/* Progress Statistics */}
        <div className="col-span-4">
          <ProgressStats data={progressData} />
        </div>

        {/* Course Details */}
        <div className="col-span-5">
          <CourseDetails />
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