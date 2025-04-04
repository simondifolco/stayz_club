import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface Hotel {
  id: string;
  name: string;
  // Add other hotel fields as needed
}

export function useHotel() {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchHotel() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("hotels")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        setHotel(data);
      } catch (error) {
        console.error("Error fetching hotel:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHotel();
  }, []);

  return { hotel, isLoading };
} 