import TopNavigation from "@/components/TopNavigation";
import DashboardGrid from "@/components/dashboard/DashboardGrid";

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

  const networks = [
    { name: 'Twitter', icon: 'https://api.iconify.design/logos:twitter.svg' },
    { name: 'Instagram', icon: 'https://api.iconify.design/skill-icons:instagram.svg' },
    { name: 'LinkedIn', icon: 'https://api.iconify.design/logos:linkedin-icon.svg' },
    { name: 'Facebook', icon: 'https://api.iconify.design/logos:facebook.svg' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <TopNavigation />
      <main className="pt-20 px-8">
        <DashboardGrid 
          chartData={chartData}
          networks={networks}
        />
      </main>
    </div>
  );
};

export default Dashboard;