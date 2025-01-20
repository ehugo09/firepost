import NetworksBox from "./boxes/NetworksBox";
import EngagementBox from "./boxes/EngagementBox";
import FollowersBox from "./boxes/FollowersBox";
import ScheduledBox from "./boxes/ScheduledBox";
import MessagesBox from "./boxes/MessagesBox";
import QuickActionsBox from "./boxes/QuickActionsBox";

interface DashboardBoxProps {
  id: string;
  networks?: Array<{ name: string; icon: string; }>;
  chartData?: Array<{ name: string; value: number; }>;
}

const DashboardBox = ({ id, networks, chartData }: DashboardBoxProps) => {
  switch(id) {
    case 'networks':
      return <NetworksBox networks={networks} />;
    case 'engagement':
      return <EngagementBox chartData={chartData} />;
    case 'followers':
      return <FollowersBox />;
    case 'scheduled':
      return <ScheduledBox />;
    case 'messages':
      return <MessagesBox />;
    case 'actions':
      return <QuickActionsBox />;
    default:
      return null;
  }
};

export default DashboardBox;