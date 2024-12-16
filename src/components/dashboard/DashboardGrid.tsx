import ProgressStats from './ProgressStats';
import CourseDetails from './CourseDetails';
import ScheduleView from './ScheduleView';

interface DashboardGridProps {
  progressData: Array<{ label: string; value: number; color: string }>;
}

const DashboardGrid = ({ progressData }: DashboardGridProps) => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 pt-24">
      <div className="grid grid-cols-12 gap-4">
        {/* Left box - Progress Statistics */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <ProgressStats data={progressData} />
        </div>

        {/* Right box - Course Details */}
        <div className="col-span-12 md:col-span-6 lg:col-span-8">
          <CourseDetails />
        </div>

        {/* Bottom box - Schedule */}
        <div className="col-span-12">
          <ScheduleView />
        </div>
      </div>
    </div>
  );
};

export default DashboardGrid;