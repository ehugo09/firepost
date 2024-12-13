import { motion, AnimatePresence } from "framer-motion";
import GridLayout from 'react-grid-layout';
import DashboardBox from "./DashboardBox";
import { useState, useEffect } from 'react';
import { Grid2X2, LockIcon, UnlockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface DashboardGridProps {
  chartData: Array<{ name: string; value: number; }>;
  networks: Array<{ name: string; icon: string; }>;
}

const DashboardGrid = ({ chartData, networks }: DashboardGridProps) => {
  const [layout, setLayout] = useState([
    { i: 'networks', x: 0, y: 0, w: 1, h: 1 },
    { i: 'engagement', x: 1, y: 0, w: 1, h: 1 },
    { i: 'followers', x: 2, y: 0, w: 1, h: 1 },
    { i: 'scheduled', x: 0, y: 1, w: 1, h: 1 },
    { i: 'messages', x: 1, y: 1, w: 1, h: 1 },
    { i: 'actions', x: 2, y: 1, w: 1, h: 1 }
  ]);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboardLayout');
    if (savedLayout) {
      try {
        setLayout(JSON.parse(savedLayout));
      } catch (error) {
        console.error('Error loading layout:', error);
      }
    }
  }, []);

  const handleLayoutChange = (newLayout: any) => {
    try {
      setLayout(newLayout);
      localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
    } catch (error) {
      console.error('Error saving layout:', error);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    toast({
      title: isEditMode ? "Edit mode disabled" : "Edit mode enabled",
      description: isEditMode 
        ? "Dashboard layout is now locked" 
        : "You can now drag and drop boxes to reorganize your dashboard",
    });
  };

  return (
    <div className="relative">
      <div className="mb-6 flex justify-end">
        <Button
          variant="outline"
          size="lg"
          onClick={toggleEditMode}
          className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <Grid2X2 className="h-5 w-5" />
          {isEditMode ? (
            <>
              <UnlockIcon className="h-5 w-5 text-primary" />
              <span className="font-medium">Lock Layout</span>
            </>
          ) : (
            <>
              <LockIcon className="h-5 w-5" />
              <span className="font-medium">Edit Layout</span>
            </>
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
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
            isDraggable={isEditMode}
            isResizable={false}
            margin={[24, 24]}
            draggableHandle=".cursor-move"
          >
            {layout.map((item) => (
              <div key={item.i}>
                <motion.div
                  className={isEditMode ? "cursor-move" : ""}
                  whileHover={isEditMode ? { scale: 1.02 } : {}}
                  whileDrag={{ scale: 1.05 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                >
                  <DashboardBox 
                    id={item.i} 
                    networks={networks}
                    chartData={chartData}
                  />
                </motion.div>
              </div>
            ))}
          </GridLayout>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DashboardGrid;