import { motion } from "framer-motion";
import { MessageSquare, BarChart2, Calendar, Settings, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
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
                  className="pl-8 w-64"
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

      {/* Main Content */}
      <div className="pt-16 lg:flex">
        {/* Sidebar */}
        <aside className="fixed w-64 h-full bg-white border-r border-gray-200 pt-5">
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
          >
            {/* Messages Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Recent Messages</h2>
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
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                        <dd className="text-lg font-semibold text-gray-900">{stat.value}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

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

const stats = [
  {
    name: "Total Messages",
    value: "28",
    icon: MessageSquare
  },
  {
    name: "Engagement Rate",
    value: "4.3%",
    icon: BarChart2
  },
  {
    name: "Scheduled Posts",
    value: "12",
    icon: Calendar
  }
];

export default Dashboard;