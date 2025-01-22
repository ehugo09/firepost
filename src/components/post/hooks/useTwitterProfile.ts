import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTwitterProfile = () => {
  return useQuery({
    queryKey: ["twitter-profile"],
    queryFn: async () => {
      console.log("Fetching Twitter profile...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No session found");
      }

      const { data: connection, error } = await supabase
        .from("social_connections")
        .select("username, profile_picture")
        .eq("user_id", session.user.id)
        .eq("platform", "twitter")
        .single();

      if (error) {
        console.error("Error fetching Twitter profile:", error);
        throw error;
      }

      console.log("Twitter profile data:", connection);
      return connection;
    },
  });
};