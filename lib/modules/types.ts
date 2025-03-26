export interface Module {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  isActive: boolean;
}

export const AVAILABLE_MODULES: Module[] = [
  {
    id: "restaurant-booking",
    name: "Restaurant Booking",
    description: "Enable guests to make restaurant reservations and view menus",
    enabled: false,
    isActive: true,
  },
  {
    id: "menu-booking",
    name: "Menu Booking",
    description: "Allow guests to pre-order meals and customize their dining experience",
    enabled: false,
    isActive: true,
  },
  {
    id: "bicycle-booking",
    name: "Bicycle Booking",
    description: "Enable guests to rent bicycles and explore the surroundings",
    enabled: false,
    isActive: true,
  },
  {
    id: "visit-booking",
    name: "Visit Booking",
    description: "Allow guests to book guided tours and local experiences",
    enabled: false,
    isActive: true,
  },
  {
    id: "room-service-booking",
    name: "Room Service Booking",
    description: "Allow guests to order room service, amenities, and housekeeping",
    enabled: false,
    isActive: true,
  },
];

export type ModuleId = typeof AVAILABLE_MODULES[number]["id"];

export interface BookingField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'time' | 'datetime' | 'select' | 'textarea' | 'checkbox';
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface ModuleConfig {
  id: string;
  name: string;
  enabled: boolean;
  bookingFields: BookingField[];
  pricing?: {
    type: 'fixed' | 'per_person' | 'per_hour';
    basePrice: number;
    currency: string;
  };
  availability?: {
    daysInAdvance: number;
    timeSlots?: {
      start: string;
      end: string;
    }[];
  };
}

export interface ModuleBookingData {
  moduleId: string;
  customerId: string;
  hotelId: string;
  bookingDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  fields: Record<string, any>;
  pricing: {
    total: number;
    currency: string;
    breakdown: {
      base: number;
      extras?: number;
      taxes?: number;
    };
  };
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number;
  maxParticipants: number;
  price: number;
  currency: string;
  images: string[];
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  included: string[];
  requirements: string[];
  cancellationPolicy: string;
}

export interface ModuleSettings {
  enabled: boolean;
  settings: {
    requiresGuide: boolean;
    minBookingNotice: number;
    allowGroupBookings: boolean;
    weatherDependent: boolean;
    difficulty: "easy" | "moderate" | "challenging";
    ageRestrictions: {
      minimum: number;
      maximum?: number;
    };
  };
  availability: {
    daysInAdvance: number;
    timeSlots: Array<{
      start: string;
      end: string;
      daysOfWeek: number[];
    }>;
    seasonalClosures: Array<{
      startDate: string;
      endDate: string;
      reason: string;
    }>;
  };
}

export interface ActivityModuleSettings {
  enabled: boolean;
  settings: {
    requiresGuide: boolean;
    minBookingNotice: number;
    allowGroupBookings: boolean;
    weatherDependent: boolean;
    difficulty: "easy" | "moderate" | "challenging";
    ageRestrictions: {
      minimum: number;
      maximum?: number;
    };
  };
  availability: {
    daysInAdvance: number;
    timeSlots: Array<{
      start: string;
      end: string;
      daysOfWeek: number[];
    }>;
    seasonalClosures: Array<{
      startDate: string;
      endDate: string;
      reason: string;
    }>;
  };
}

export interface WellnessService {
  id: string;
  name: string;
  description: string;
  category: "massage" | "spa" | "beauty" | "fitness" | "meditation";
  duration: number;
  price: number;
  currency: string;
  images: string[];
  benefits: string[];
  contraindications: string[];
}

export interface WellnessPractitioner {
  id: string;
  name: string;
  specialties: string[];
  certifications: string[];
  bio: string;
  image: string;
  languages: string[];
  availability: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
}

export interface WellnessFacility {
  id: string;
  name: string;
  type: "treatment_room" | "sauna" | "pool" | "gym" | "yoga_studio";
  capacity: number;
  amenities: string[];
  images: string[];
}

export interface WellnessModuleSettings {
  enabled: boolean;
  bookingNotice: number;
  cancellationPolicy: {
    deadline: number;
    refundPercentage: number;
  };
  availability: {
    daysInAdvance: number;
    operatingHours: Array<{
      dayOfWeek: number;
      start: string;
      end: string;
    }>;
    breakTimes: Array<{
      start: string;
      end: string;
    }>;
    holidayClosures: Array<{
      date: string;
      reason: string;
    }>;
  };
}

export interface DiningItem {
  id: string;
  name: string;
  description: string;
  category: "breakfast" | "lunch" | "dinner" | "drinks" | "dessert";
  price: number;
  currency: string;
  images: string[];
  allergens: string[];
  dietaryInfo: string[];
  preparationTime: number;
  isAvailable: boolean;
}

export interface DiningTable {
  id: string;
  number: string;
  capacity: number;
  location: string;
  isOutdoor: boolean;
}

export interface DiningModuleSettings {
  enabled: boolean;
  settings: {
    requiresDeposit: boolean;
    depositAmount: number;
    allowsCancellation: boolean;
    cancellationPolicy: {
      deadline: number;
      refundPercentage: number;
    };
    minBookingNotice: number;
    maxPartySize: number;
    averageDiningTime: number;
    autoConfirm: boolean;
  };
  availability: {
    daysInAdvance: number;
    serviceHours: Array<{
      dayOfWeek: number;
      service: "breakfast" | "lunch" | "dinner";
      start: string;
      end: string;
    }>;
    specialClosures: Array<{
      date: string;
      reason: string;
    }>;
  };
}

export interface Ticket {
  id: string;
  name: string;
  description: string;
  type: "event" | "show" | "concert" | "exhibition" | "tour";
  date: string;
  time: string;
  venue: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  price: number;
  currency: string;
  capacity: number;
  availableTickets: number;
  images: string[];
  category: string[];
  duration: number;
  restrictions: string[];
}

export interface TicketModuleSettings {
  enabled: boolean;
  settings: {
    allowsResale: boolean;
    requiresIdentification: boolean;
    allowsCancellation: boolean;
    cancellationPolicy: {
      deadline: number;
      refundPercentage: number;
    };
    maxTicketsPerBooking: number;
    autoConfirm: boolean;
  };
  availability: {
    daysInAdvance: number;
    salesPeriod: {
      start: string;
      end: string;
    };
  };
}

export interface Rental {
  id: string;
  name: string;
  description: string;
  category: "sports" | "electronics" | "equipment" | "vehicles" | "other";
  price: number;
  currency: string;
  quantity: number;
  availableQuantity: number;
  images: string[];
  specifications: string[];
  requirements: string[];
  isAvailable: boolean;
  maintenanceSchedule: {
    lastMaintenance: string;
    nextMaintenance: string;
    maintenanceInterval: number;
  };
  insuranceRequired: boolean;
  depositAmount: number;
}

export interface RentalModuleSettings {
  enabled: boolean;
  settings: {
    requiresDeposit: boolean;
    depositAmount: number;
    allowsCancellation: boolean;
    cancellationPolicy: {
      deadline: number;
      refundPercentage: number;
    };
    minBookingNotice: number;
    maxRentalDuration: number;
    autoConfirm: boolean;
  };
  availability: {
    daysInAdvance: number;
    specialClosures: Array<{
      startDate: string;
      endDate: string;
      reason: string;
    }>;
  };
}

// Common types
interface BaseModuleSettings {
  enabled: boolean;
  settings: {
    requiresDeposit: boolean;
    depositAmount: number;
    allowsCancellation: boolean;
    cancellationPolicy: {
      deadline: number; // hours before event/service
      refundPercentage: number;
    };
  };
}

// Transfer Module Types
export interface Transfer {
  id: string;
  name: string;
  description: string;
  type: "airport" | "station" | "port" | "custom";
  vehicle: {
    type: string;
    capacity: number;
    features: string[];
    image?: string;
  };
  price: number;
  currency: string;
  duration: number;
  distance: number;
  route: {
    pickup: {
      name: string;
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    dropoff: {
      name: string;
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
  };
  availableVehicles: number;
  requirements: string[];
  cancellationPolicy: {
    deadline: number;
    refundPercentage: number;
  };
}

export interface TransferModuleSettings extends BaseModuleSettings {
  settings: {
    requiresDeposit: boolean;
    depositAmount: number;
    allowsCancellation: boolean;
    cancellationPolicy: {
      deadline: number;
      refundPercentage: number;
    };
    minBookingNotice: number;
    maxPassengers: number;
    autoConfirm: boolean;
    luggageRestrictions: {
      maxPieces: number;
      maxWeightPerPiece: number;
    };
  };
  availability: {
    daysInAdvance: number;
    operatingHours: Array<{
      dayOfWeek: number;
      start: string;
      end: string;
    }>;
    specialClosures: Array<{
      startDate: string;
      endDate: string;
      reason: string;
    }>;
  };
} 