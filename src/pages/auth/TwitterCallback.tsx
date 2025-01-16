import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const TwitterCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session to confirm the user is authenticated
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session) {
          console.log('Twitter authentication successful:', session);
          toast.success('Successfully connected to Twitter!');
        } else {
          console.error('No session found after Twitter auth');
          toast.error('Authentication failed');
        }

        // Redirect back to dashboard in either case
        navigate('/dashboard');
        
      } catch (error) {
        console.error('Error in Twitter callback:', error);
        toast.error('Failed to complete authentication');
        navigate('/dashboard');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Completing authentication...</p>
      </div>
    </div>
  );
};

export default TwitterCallback;