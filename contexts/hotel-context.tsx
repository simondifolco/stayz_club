"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";

interface Hotel {
  id: number;
  name: string;
  slug: string;
  user_id: string;
  description?: string;
  logo_url?: string;
  theme?: Record<string, unknown>;
}

interface HotelContextType {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  setSelectedHotel: (hotel: Hotel) => void;
  addHotel: (hotelData: { name: string; slug: string }) => Promise<void>;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export function HotelProvider({ children }: { children: ReactNode }) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Load hotels from Supabase
    const loadHotels = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No user found');
        return;
      }

      const { data: hotels, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading hotels:', error);
        return;
      }

      if (hotels && hotels.length > 0) {
        setHotels(hotels);
        setSelectedHotel(hotels[0]);
      }
    };

    loadHotels();
  }, []);

  const addHotel = async (hotelData: { name: string; slug: string }) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting user:', userError);
        return;
      }

      const { data: hotel, error: insertError } = await supabase
        .from('hotels')
        .insert([{
          ...hotelData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error adding hotel:', insertError);
        return;
      }

      if (hotel) {
        setHotels([...hotels, hotel]);
        setSelectedHotel(hotel);
      }
    } catch (error) {
      console.error('Error in addHotel:', error);
    }
  };

  return (
    <HotelContext.Provider
      value={{
        hotels,
        selectedHotel,
        setSelectedHotel,
        addHotel,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
}

export function useHotel() {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
} 