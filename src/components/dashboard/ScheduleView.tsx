import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ScheduleView = () => {
  const scheduleItems = [
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
      current: true
    },
    {
      time: "16:00 — 17:00",
      title: "Technical Spanish for Beginners",
      level: "Beginner",
      mentor: { name: "Jacob Jones", role: "Mentor" }
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My schedule</h2>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="py-2 px-4">Today</span>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scheduleItems.map((item, index) => (
          <div 
            key={index}
            className={`p-6 rounded-xl ${
              item.current ? 'bg-[#8B5CF6] text-white' : 'bg-gray-50'
            }`}
          >
            <div className="text-sm mb-2">{item.time}</div>
            <h3 className="text-lg font-medium mb-2">{item.title}</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${
              item.current ? 'bg-white/20' : 'bg-blue-100 text-blue-700'
            }`}>
              {item.level}
            </span>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div>
                <div className={`font-medium ${item.current ? 'text-white' : 'text-gray-900'}`}>
                  {item.mentor.name}
                </div>
                <div className={item.current ? 'text-white/80' : 'text-gray-500'}>
                  {item.mentor.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ScheduleView;