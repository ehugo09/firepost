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
    <Card className="p-4 bg-white"> {/* Reduced padding from p-6 to p-4 */}
      <div className="flex justify-between items-center mb-4"> {/* Reduced margin from mb-6 to mb-4 */}
        <h2 className="text-xl font-semibold">My schedule</h2> {/* Reduced text size from 2xl to xl */}
        <div className="flex gap-2">
          <button className="p-1.5 rounded-full hover:bg-gray-100"> {/* Reduced padding */}
            <ChevronLeft className="w-4 h-4" /> {/* Reduced icon size */}
          </button>
          <span className="py-1.5 px-3">Today</span> {/* Reduced padding */}
          <button className="p-1.5 rounded-full hover:bg-gray-100"> {/* Reduced padding */}
            <ChevronRight className="w-4 h-4" /> {/* Reduced icon size */}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3"> {/* Reduced gap from gap-4 to gap-3 */}
        {scheduleItems.map((item, index) => (
          <div 
            key={index}
            className={`p-4 rounded-xl ${  /* Reduced padding from p-6 to p-4 */
              item.current ? 'bg-[#8B5CF6] text-white' : 'bg-gray-50'
            }`}
          >
            <div className="text-sm mb-1">{item.time}</div> {/* Reduced margin */}
            <h3 className="text-base font-medium mb-1.5">{item.title}</h3> {/* Reduced text size and margin */}
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-sm mb-3 ${
              item.current ? 'bg-white/20' : 'bg-blue-100 text-blue-700'
            }`}>
              {item.level}
            </span>
            <div className="flex items-center gap-2"> {/* Reduced gap */}
              <div className="w-6 h-6 rounded-full bg-gray-200" /> {/* Reduced avatar size */}
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