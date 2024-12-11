import { motion } from "framer-motion";
import { MessageSquare, BarChart2, Calendar, Settings, Bell, Search, ArrowUpRight, Send, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const chartData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 400 },
    { name: 'Sun', value: 300 },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-100 fixed w-full z-30 top-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/09171096-3f2b-41d5-8b3e-092b36199d42.png" 
                alt="Pandapost Logo" 
                className="h-8 w-8"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900">Pandapost</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search..." 
                  className="pl-8 w-64 bg-gray-50/50"
                />
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 lg:flex">
        {/* Sidebar */}
        <aside className="fixed w-64 h-full bg-white border-r border-gray-100 pt-5">
          <nav className="mt-5 px-2">
            <a href="#" className="group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-primary bg-primary/10">
              <MessageSquare className="mr-4 h-6 w-6" />
              Messages
            </a>
            <a href="#" className="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <BarChart2 className="mr-4 h-6 w-6" />
              Analytics
            </a>
            <a href="#" className="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <Calendar className="mr-4 h-6 w-6" />
              Schedule
            </a>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 ml-64 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Social Network Card */}
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">Connected Networks</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {networks.map((network, index) => (
                    <div key={index} className="flex items-center p-2 rounded-full border border-gray-100 bg-white">
                      <img src={network.icon} alt={network.name} className="h-5 w-5" />
                      <span className="ml-2 text-sm font-medium">{network.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics Card */}
            <Card className="col-span-1">
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

            {/* Quick Actions Card */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <button className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100">
                    <MessageSquare className="h-6 w-6 mb-2" />
                    <span className="text-sm">Message</span>
                  </button>
                  <button className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100">
                    <Send className="h-6 w-6 mb-2" />
                    <span className="text-sm">Post</span>
                  </button>
                  <button className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100">
                    <Download className="h-6 w-6 mb-2" />
                    <span className="text-sm">Export</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">Recent Messages</CardTitle>
                <span className="text-sm text-gray-500">View all</span>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className="flex items-start p-4 hover:bg-gray-50 rounded-lg transition-colors">
                      <img src={message.avatar} alt={message.name} className="w-10 h-10 rounded-full" />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{message.name}</p>
                          <span className="text-sm text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-sm text-gray-500">{message.platform}</p>
                        <p className="mt-1 text-sm text-gray-900">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </motion.div>
        </main>
      </div>
    </div>
  );
};

const networks = [
  { name: 'Twitter', icon: 'https://api.iconify.design/logos:twitter.svg' },
  { name: 'Instagram', icon: 'https://api.iconify.design/skill-icons:instagram.svg' },
  { name: 'LinkedIn', icon: 'https://api.iconify.design/logos:linkedin-icon.svg' },
  { name: 'Facebook', icon: 'https://api.iconify.design/logos:facebook.svg' },
];

const messages = [
  {
    name: "Sarah Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    platform: "Twitter",
    content: "Love your new product! When will it be available in Europe?",
    time: "5m ago"
  },
  {
    name: "John Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    platform: "Instagram",
    content: "Great content! Would love to collaborate.",
    time: "15m ago"
  },
  {
    name: "Emma Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    platform: "Facebook",
    content: "Quick question about your services...",
    time: "1h ago"
  }
];

export default Dashboard;