"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";

interface Hotel {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  user_id: string;
  logo_url?: string;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    darkMode: boolean;
    showLogo: boolean;
    buttonStyle: "minimal" | "outline" | "solid" | "soft";
    font: "geist" | "inter" | "manrope" | "montserrat";
    bookingUrl?: string;
    contactEmail?: string;
  };
}

interface HotelContextType {
  hotels: Hotel[];
  selectedHotel: Hotel | null;
  setSelectedHotel: (hotel: Hotel) => void;
  addHotel: (hotelData: { name: string; slug: string }) => Promise<void>;
  isLoading: boolean;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export function HotelProvider({ children }: { children: ReactNode }) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const loadHotels = async () => {
      try {
        setIsLoading(true);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No user found:', userError);
          return;
        }

        console.log('Loading hotels for user:', {
          userId: user.id,
          userEmail: user.email
        });

        // First, verify the user's session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error('Session error:', sessionError);
          return;
        }

        // Get hotels for the current user
        const { data: hotels, error } = await supabase
          .from('hotels')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading hotels:', {
            error,
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            userId: user.id
          });
          return;
        }

        if (!mounted) return;

        if (hotels && hotels.length > 0) {
          // If we already have a selected hotel, verify it exists in the loaded hotels
          let hotelToSelect = hotels[0];
          
          if (selectedHotel) {
            const existingHotel = hotels.find(h => h.id === selectedHotel.id);
            if (existingHotel) {
              hotelToSelect = existingHotel;
            } else {
              console.warn('Selected hotel not found in loaded hotels:', {
                selectedHotelId: selectedHotel.id,
                selectedHotelName: selectedHotel.name,
                availableHotels: hotels.map(h => ({ id: h.id, name: h.name, userId: h.user_id }))
              });
            }
          }

          console.log('Setting hotels and selected hotel:', {
            hotels: hotels.map(h => ({ id: h.id, name: h.name, userId: h.user_id })),
            selectedHotel: hotelToSelect,
            previousSelectedHotel: selectedHotel,
            userId: user.id
          });

          setHotels(hotels);
          setSelectedHotel(hotelToSelect);
        } else {
          console.log('No hotels found for user:', {
            userId: user.id,
            userEmail: user.email
          });
          setHotels([]);
          setSelectedHotel(null);
        }
      } catch (error) {
        console.error('Error in loadHotels:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadHotels();

    return () => {
      mounted = false;
    };
  }, []); // Remove selectedHotel?.id dependency to prevent infinite loops

  const addHotel = async (hotelData: { name: string; slug: string }) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Authentication error: ' + (userError?.message || 'No user found'));
      }

      // Verify the user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Session error: ' + (sessionError?.message || 'No active session'));
      }

      const { data: hotel, error: insertError } = await supabase
        .from('hotels')
        .insert([{
          name: hotelData.name,
          slug: hotelData.slug,
          user_id: user.id,
          is_active: true
        }])
        .select()
        .single();

      if (insertError) {
        throw new Error('Failed to add hotel: ' + insertError.message);
      }

      if (hotel) {
        console.log('Hotel added successfully:', {
          hotel,
          userId: user.id
        });
        setHotels([...hotels, hotel]);
        setSelectedHotel(hotel);
      }
    } catch (error: any) {
      console.error('Error in addHotel:', error);
      throw error;
    }
  };

  const handleSetSelectedHotel = (hotel: Hotel) => {
    // Verify the hotel exists in the current hotels list
    const hotelExists = hotels.some(h => h.id === hotel.id);
    if (!hotelExists) {
      console.error('Attempted to select hotel that does not exist:', {
        hotel,
        availableHotels: hotels.map(h => ({ id: h.id, name: h.name, userId: h.user_id }))
      });
      return;
    }
    setSelectedHotel(hotel);
  };

  return (
    <HotelContext.Provider
      value={{
        hotels,
        selectedHotel,
        setSelectedHotel: handleSetSelectedHotel,
        addHotel,
        isLoading
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