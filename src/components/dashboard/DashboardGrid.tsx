import { motion } from "framer-motion";
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, MessageSquare, Users, Clock, BarChart3 } from "lucide-react";

interface DashboardGridProps {
  chartData: Array<{ name: string; value: number }>;
  networks: Array<{ name: string; icon: string; lessons: number; hours: number }>;
}

const DashboardGrid = ({ chartData, networks }: DashboardGridProps) => {
  const [progress, setProgress] = useState(64);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {/* Social Media Overview */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold">Connected Networks</h2>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">4 Active</span>
        </div>
        <div className="space-y-2">
          {networks.map((network, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span>{network.name}</span>
              <span className="text-green-500">●</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Messages Overview */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-semibold">Messages</h2>
          </div>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">12 New</span>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold">48</div>
          <div className="text-xs text-gray-500">Total unread messages</div>
          <Progress value={75} className="h-1" />
        </div>
      </Card>

      {/* Audience Growth */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            <h2 className="text-sm font-semibold">Audience</h2>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold">12.5K</div>
          <div className="text-xs text-gray-500">Total followers</div>
          <div className="text-xs text-green-500">+2.4% this week</div>
        </div>
      </Card>

      {/* Scheduled Posts */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <h2 className="text-sm font-semibold">Scheduled</h2>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold">8</div>
          <div className="text-xs text-gray-500">Pending posts</div>
          <div className="text-xs text-orange-500">Next in 2 hours</div>
        </div>
      </Card>

      {/* Engagement Stats */}
      <Card className="p-4 md:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-semibold">Engagement Rate</h2>
          </div>
          <select className="text-xs border rounded px-2 py-1">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
        <div className="h-[120px] flex items-end justify-between gap-2">
          {chartData.map((item, index) => (
            <div key={index} className="w-full">
              <div 
                className="bg-indigo-100 rounded-sm" 
                style={{ height: `${item.value}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {chartData.map((item, index) => (
            <span key={index}>{item.name}</span>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-4 md:col-span-2">
        <h2 className="text-sm font-semibold mb-3">Recent Activity</h2>
        <div className="space-y-2">
          {[
            { network: 'Twitter', action: 'New follower', time: '2m ago' },
            { network: 'Instagram', action: 'Post liked', time: '5m ago' },
            { network: 'LinkedIn', action: 'Message received', time: '15m ago' },
            { network: 'Facebook', action: 'Comment on post', time: '1h ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{activity.network}</span>
                <span className="text-gray-500">{activity.action}</span>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4 md:col-span-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Today's Schedule</h2>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-lg border"><ChevronLeft className="w-3 h-3" /></button>
            <button className="p-1 rounded-lg border"><ChevronRight className="w-3 h-3" /></button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              time: "10:00 AM",
              title: "Tweet about product update",
              platform: "Twitter",
              status: "pending"
            },
            {
              time: "2:00 PM",
              title: "Share customer success story",
              platform: "LinkedIn",
              status: "pending"
            },
            {
              time: "4:30 PM",
              title: "Post weekly highlights",
              platform: "Instagram",
              status: "pending"
            }
          ].map((post, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border bg-gray-50"
            >
              <div className="text-xs text-gray-500">{post.time}</div>
              <div className="font-medium text-sm mt-1">{post.title}</div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{post.platform}</span>
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                  {post.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardGrid;