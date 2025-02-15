import LatestActivityContainer from "./LatestActivityContainer";
import ScheduleTimeline from "./ScheduleTimeline";
import QuickAnalytics from "./QuickAnalytics";

const DashboardGrid = () => {
  console.log("Rendering DashboardGrid");
  
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Top row with Quick Analytics and Latest Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <QuickAnalytics />
        </div>
        <div className="space-y-6">
          <LatestActivityContainer />
        </div>
      </div>
      
      {/* Bottom row with Schedule Timeline */}
      <div className="w-full">
        <ScheduleTimeline />
      </div>
    </div>
  );
};

export default DashboardGrid;