import { ArrowUpRight, Send, Download, Users, Inbox, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import TopNavigation from "@/components/TopNavigation";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GridLayout from 'react-grid-layout';
import { useState, useEffect } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const Dashboard = () => {
  const [layout, setLayout] = useState([
    { i: 'networks', x: 0, y: 0, w: 1, h: 1 },
    { i: 'engagement', x: 1, y: 0, w: 1, h: 1 },
    { i: 'followers', x: 2, y: 0, w: 1, h: 1 },
    { i: 'scheduled', x: 0, y: 1, w: 1, h: 1 },
    { i: 'messages', x: 1, y: 1, w: 1, h: 1 },
    { i: 'actions', x: 2, y: 1, w: 1, h: 1 }
  ]);

  // Load saved layout from localStorage on component mount
  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboardLayout');
    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    }
  }, []);

  // Save layout to localStorage when it changes
  const handleLayoutChange = (newLayout: any) => {
    setLayout(newLayout);
    localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
  };

  const chartData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 400 },
    { name: 'Sun', value: 300 },
  ];

  const networks = [
    { name: 'Twitter', icon: 'https://api.iconify.design/logos:twitter.svg' },
    { name: 'Instagram', icon: 'https://api.iconify.design/skill-icons:instagram.svg' },
    { name: 'LinkedIn', icon: 'https://api.iconify.design/logos:linkedin-icon.svg' },
    { name: 'Facebook', icon: 'https://api.iconify.design/logos:facebook.svg' },
  ];

  const renderBox = (id: string) => {
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
                {networks.map((network, index) => (
                  <div key={index} className="flex items-center p-2 rounded-full border border-gray-100 bg-white">
                    <img src={network.icon} alt={network.name} className="h-5 w-5" />
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

  return (
    <div className="min-h-screen bg-gray-50/50">
      <TopNavigation />
      <main className="pt-20 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GridLayout
            className="layout"
            layout={layout}
            cols={3}
            rowHeight={300}
            width={1200}
            onLayoutChange={handleLayoutChange}
            isDraggable={true}
            isResizable={false}
            margin={[24, 24]}
          >
            {layout.map((item) => (
              <div key={item.i} className="cursor-move">
                {renderBox(item.i)}
              </div>
            ))}
          </GridLayout>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;