import LatestActivityContainer from "./LatestActivityContainer";
import ShortcutsContainer from "./ShortcutsContainer";
import ScheduleTimeline from "./ScheduleTimeline";
import QuickAnalytics from "./QuickAnalytics";

const DashboardGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 h-full">
      {/* Top row with Quick Analytics and Latest Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[400px]">
        <QuickAnalytics />
        <LatestActivityContainer />
      </div>
      
      {/* Bottom row with Schedule Timeline */}
      <div className="w-full flex-1">
        <ScheduleTimeline />
      </div>
    </div>
  );
};

export default DashboardGrid;