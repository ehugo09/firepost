import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import DashboardBox from "./DashboardBox";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DashboardGridProps {
  chartData: Array<{ name: string; value: number; }>;
  networks: Array<{ name: string; icon: string; lessons: number; hours: number; }>;
}

const DashboardGrid = ({ chartData, networks }: DashboardGridProps) => {
  const [totalHours, setTotalHours] = useState(24.9);
  const [progress, setProgress] = useState(64);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* Activity Card */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">Activity</h2>
          <button className="px-3 py-1 text-xs bg-white rounded-full border">Last 7 days</button>
        </div>
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{totalHours}</span>
            <span className="text-gray-500">Hours spent</span>
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-[200px] relative">
            {/* Chart will go here */}
            <div className="absolute top-1/2 w-full border-dashed border-t border-gray-300">
              <span className="absolute -left-16 -translate-y-3 text-sm text-gray-500">4.2 hours</span>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">By platform</h3>
            {networks.map((network, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={network.icon} alt={network.name} className="w-6 h-6" />
                  <div>
                    <p className="font-medium">{network.name}</p>
                    <p className="text-sm text-gray-500">{network.lessons} lessons</p>
                  </div>
                </div>
                <span className="text-gray-600">{network.hours}h</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Progress Statistics Card */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold mb-5">Progress statistics</h2>
        <div className="mb-8">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold">{progress}%</span>
            <span className="text-gray-500">Total activity</span>
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <div className="flex justify-between text-sm text-gray-500">
            <span>24%</span>
            <span>35%</span>
            <span>41%</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
              <span className="text-xl font-semibold text-purple-600">8</span>
            </div>
            <p className="text-sm text-gray-500">In progress</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <span className="text-xl font-semibold text-green-600">12</span>
            </div>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
              <span className="text-xl font-semibold text-orange-600">14</span>
            </div>
            <p className="text-sm text-gray-500">Upcoming</p>
          </div>
        </div>
      </Card>

      {/* Course Card */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Group course</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Advanced</span>
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-2">English punctuation made easy</h2>
        <p className="text-gray-500 text-sm mb-6">
          Punctuation — learn the basics without the pain. People will never laugh at your punctuation again.
        </p>
        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Participants</p>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Course progress</p>
            <Progress value={75} className="h-2 bg-yellow-100">
              <div className="h-full bg-yellow-400" style={{ width: '75%' }} />
            </Progress>
          </div>
        </div>
        <button className="w-full py-3 bg-black text-white rounded-lg font-medium">
          Continue learning
        </button>
      </Card>

      {/* Schedule Card */}
      <Card className="p-5 col-span-full">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">My schedule</h2>
          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded-lg border"><ChevronLeft className="w-4 h-4" /></button>
            <span className="font-medium text-sm">Today</span>
            <button className="p-1.5 rounded-lg border"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              time: "10:30 — 12:00",
              title: "Technical English for Beginners",
              level: "Beginner",
              mentor: { name: "Kristin Watson", role: "Mentor" }
            },
            {
              time: "13:00 — 14:00",
              title: "English punctuation made easy",
              level: "Advanced",
              mentor: { name: "Cody Fisher", role: "Mentor" },
              active: true
            },
            {
              time: "16:00 — 17:00",
              title: "Technical Spanish for Beginners",
              level: "Beginner",
              mentor: { name: "Jacob Jones", role: "Mentor" }
            }
          ].map((session, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl ${
                session.active 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white border'
              }`}
            >
              <p className="text-sm mb-4">{session.time}</p>
              <h3 className="font-semibold mb-2">{session.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                session.active
                  ? 'bg-white/20'
                  : session.level === 'Beginner'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
              }`}>
                {session.level}
              </span>
              <div className="mt-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <p className={`font-medium ${session.active ? 'text-white' : 'text-gray-900'}`}>
                    {session.mentor.name}
                  </p>
                  <p className={session.active ? 'text-white/80' : 'text-gray-500'}>
                    {session.mentor.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardGrid;
