import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Instagram } from "lucide-react";
import { ConnectInstagram } from "./ConnectInstagram";
import { useState } from "react";
import { toast } from "sonner";

export const InstagramIntegration = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleInstagramAuth = async () => {
    setIsConnecting(true);
    try {
      // In a real implementation, this would redirect to Instagram's OAuth flow
      console.log("Starting Instagram OAuth flow...");
      toast.info("Instagram OAuth integration coming soon!");
    } catch (error) {
      console.error("Instagram auth error:", error);
      toast.error("Failed to connect to Instagram");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Instagram className="h-5 w-5" />
          Instagram Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ConnectInstagram />
      </CardContent>
    </Card>
  );
};