import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { PostForm } from "@/types/post";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScheduledPost {
  date: Date;
  title: string;
  platforms: string[];
}

const mockScheduledPosts: ScheduledPost[] = [
  {
    date: new Date(2024, 3, 15, 10, 30),
    title: "Product Launch Announcement",
    platforms: ["twitter", "instagram"]
  },
  {
    date: new Date(2024, 3, 16, 14, 0),
    title: "Customer Success Story",
    platforms: ["linkedin"]
  }
];

interface PostSchedulerProps {
  form: UseFormReturn<PostForm>;
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export const PostScheduler = ({ form, date, onDateSelect }: PostSchedulerProps) => {
  const isScheduled = form.watch("postType") === "schedule";

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="postType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">When to post</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="now" id="now" />
                  <Label htmlFor="now">Post now</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="schedule" id="schedule" />
                  <Label htmlFor="schedule">Schedule</Label>
                </div>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />

      {isScheduled && (
        <div className="space-y-4">
          <Label className="text-base">Select Date and Time</Label>
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={onDateSelect}
                  initialFocus
                  className="rounded-md border"
                />
                <ScrollArea className="h-[150px] p-4 border-t">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium mb-2">Scheduled Posts</h4>
                    {mockScheduledPosts.map((post, index) => (
                      <div 
                        key={index}
                        className="p-2 text-sm rounded-md bg-accent/10 border border-accent/20"
                        style={{ borderColor: '#E86643', backgroundColor: 'rgba(232, 102, 67, 0.1)' }}
                      >
                        <div className="font-medium">{format(post.date, 'HH:mm')}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {post.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              className="w-[120px] justify-start text-left font-normal"
            >
              <Clock className="mr-2 h-4 w-4" />
              <span>Set time</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};