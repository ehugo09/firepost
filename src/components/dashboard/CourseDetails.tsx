import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const CourseDetails = () => {
  return (
    <Card className="p-6">
      <div className="flex gap-2 mb-4">
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Group course</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Advanced</span>
      </div>

      <h2 className="text-2xl font-semibold mb-2">English punctuation made easy</h2>
      <p className="text-gray-600 mb-8">
        Punctuation — learn the basics without the pain. People will never laugh at your punctuation again. You do not require any materials or software.
      </p>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm text-gray-500 mb-2">Participants</h3>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"
              />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-gray-500 mb-2">Course progress</h3>
          <div className="bg-yellow-100 rounded-full h-6 relative">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-yellow-400 rounded-full"
              style={{ width: '75%' }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">75%</span>
          </div>
        </div>
      </div>

      <button className="w-full mt-8 bg-black text-white rounded-lg py-3 font-medium">
        Continue learning
      </button>
    </Card>
  );
};

export default CourseDetails;