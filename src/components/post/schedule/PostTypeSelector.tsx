import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { PostForm } from "@/types/post";

interface PostTypeSelectorProps {
  form: UseFormReturn<PostForm>;
}

export const PostTypeSelector = ({ form }: PostTypeSelectorProps) => {
  return (
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
                <RadioGroupItem 
                  value="now" 
                  id="now" 
                  className="border-[#E86643] text-[#E86643] [&[data-state=checked]]:bg-[#E86643] [&[data-state=checked]]:text-white"
                />
                <Label htmlFor="now">Post now</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="schedule" 
                  id="schedule"
                  className="border-[#E86643] text-[#E86643] [&[data-state=checked]]:bg-[#E86643] [&[data-state=checked]]:text-white"
                />
                <Label htmlFor="schedule">Schedule</Label>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};