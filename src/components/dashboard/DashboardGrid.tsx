import AudienceCard from "./AudienceCard";
import ScheduledCard from "./ScheduledCard";
import LatestActivityContainer from "./LatestActivityContainer";
import ShortcutsContainer from "./ShortcutsContainer";
import MessagesCard from "./MessagesCard";

const DashboardGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <div className="lg:col-span-2 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ShortcutsContainer />
          <AudienceCard />
        </div>
        <LatestActivityContainer />
      </div>
      <div className="space-y-4">
        <ScheduledCard />
        <MessagesCard />
      </div>
    </div>
  );
};

export default DashboardGrid;