import { Card } from "@/components/ui/card";

interface DashboardBoxProps {
  id: string;
  networks?: Array<{ name: string; icon: string; }>;
  chartData?: Array<{ name: string; value: number; }>;
}

const DashboardBox = ({ id, networks, chartData }: DashboardBoxProps) => {
  const sanitizeUrl = (url: string) => {
    return url.replace(/:\/$/, '');
  };

  switch(id) {
    case 'networks':
      return (
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Connected Networks</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {networks?.map((network, index) => (
                <div key={index} className="flex items-center p-2 rounded-full border border-gray-100 bg-white">
                  <img src={sanitizeUrl(network.icon)} alt={network.name} className="h-5 w-5" />
                  <span className="ml-2 text-sm font-medium">{network.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    case 'engagement':
      return (
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Engagement Rate</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2ECC71" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#2ECC71" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      );
    case 'followers':
      return (
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">24.5K</div>
            <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
          </CardContent>
        </Card>
      );
    case 'scheduled':
      return (
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Scheduled Posts</CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">12</div>
            <p className="text-sm text-gray-500 mt-2">Posts scheduled for this week</p>
          </CardContent>
        </Card>
      );
    case 'messages':
      return (
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Unread Messages</CardTitle>
            <Inbox className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">28</div>
            <p className="text-sm text-gray-500 mt-2">Across all platforms</p>
          </CardContent>
        </Card>
      );
    case 'actions':
      return (
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <button className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100">
                <Send className="h-6 w-6 mb-2" />
                <span className="text-sm">Post</span>
              </button>
              <button className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100">
                <Clock className="h-6 w-6 mb-2" />
                <span className="text-sm">Schedule</span>
              </button>
              <button className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100">
                <Download className="h-6 w-6 mb-2" />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
};

export default DashboardBox;
