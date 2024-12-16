import { Card } from "@/components/ui/card";

const CourseDetails = () => {
  return (
    <Card className="p-4 bg-white h-full">
      <div className="flex gap-2 mb-3">
        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">Group course</span>
        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">Advanced</span>
      </div>

      <h2 className="text-xl font-semibold mb-2">English punctuation made easy</h2>
      <p className="text-gray-600 mb-4 text-sm">
        Punctuation — learn the basics without the pain. People will never laugh at your punctuation again. You do not require any materials or software.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs text-gray-500 mb-1">Participants</h3>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="w-6 h-6 rounded-full border-2 border-white bg-gray-200"
              />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs text-gray-500 mb-1">Course progress</h3>
          <div className="bg-yellow-100 rounded-full h-4 relative">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-yellow-400 rounded-full"
              style={{ width: '75%' }}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">75%</span>
          </div>
        </div>
      </div>

      <button className="w-full mt-4 bg-black text-white rounded-lg py-2 text-sm font-medium">
        Continue learning
      </button>
    </Card>
  );
};

export default CourseDetails;