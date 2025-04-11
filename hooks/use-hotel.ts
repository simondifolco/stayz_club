import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface Hotel {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  // Add other hotel fields as needed
}

export function useHotel() {
  const supabase = createClient();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHotel() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('hotels')
          .select('*')
          .single();

        if (error) throw error;
        setHotel(data);
      } catch (error) {
        console.error('Error fetching hotel:', error);
        setHotel(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHotel();
  }, [supabase]);

  return {
    selectedHotel: hotel,
    isLoading
  };
} 