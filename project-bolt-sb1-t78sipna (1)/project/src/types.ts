export type Category =
  | 'heritage'
  | 'landmark'
  | 'food'
  | 'restaurant'
  | 'accommodation'
  | 'attraction'
  | 'park'
  | 'cultural';

export type FoodType =
  | 'street-food'
  | 'saoji'
  | 'cafe'
  | 'restaurant'
  | 'vegetarian'
  | 'budget'
  | 'breakfast';

export const FOOD_TYPE_LABELS: Record<FoodType, string> = {
  'street-food': 'Street Food',
  'saoji': 'Saoji Cuisine',
  'cafe': 'Cafes',
  'restaurant': 'Restaurants',
  'vegetarian': 'Vegetarian',
  'budget': 'Budget-Friendly',
  'breakfast': 'Breakfast & Poha',
};

export interface Place {
  id: string;
  name: string;
  category: Category;
  description: string;
  lat: number;
  lng: number;
  address: string;
  area: string;
  images: string[];
  imageAttribution?: string;
  source: string;
  sourceUrl?: string;
  lastUpdated: string;
  hours?: string;
  priceLevel?: 1 | 2 | 3;
  entryFee?: string;
  verified: boolean;
  tags: string[];
  foodTypes?: FoodType[];
  historicalContext?: string;
  established?: string;
  nearbyIds?: string[];
}

export interface SafetyReport {
  id: string;
  placeId?: string;
  placeName: string;
  area: string;
  category: 'infrastructure' | 'sanitation' | 'safety' | 'environment' | 'other';
  status: 'pending' | 'verified' | 'rejected' | 'unknown';
  description: string;
  lat: number;
  lng: number;
  reportedAt: string;
  source: string;
  evidenceCount: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  retrievedAt: string;
  source: string;
}

export const CATEGORY_META: Record<Category, { label: string; icon: string; color: string; pinColor: string }> = {
  heritage:   { label: 'Heritage',        icon: 'Landmark',      color: 'text-amber-700 bg-amber-100',  pinColor: '#d97706' },
  landmark:   { label: 'Landmark',        icon: 'Monument',      color: 'text-rose-700 bg-rose-100',    pinColor: '#be123c' },
  food:       { label: 'Hidden Food',     icon: 'UtensilsCrossed', color: 'text-orange-700 bg-orange-100', pinColor: '#ea580c' },
  restaurant: { label: 'Restaurant',      icon: 'ChefHat',       color: 'text-teal-700 bg-teal-100',    pinColor: '#0d9488' },
  accommodation: { label: 'Stay',         icon: 'BedDouble',     color: 'text-indigo-700 bg-indigo-100', pinColor: '#4338ca' },
  attraction: { label: 'Attraction',      icon: 'Camera',        color: 'text-purple-700 bg-purple-100', pinColor: '#7e22ce' },
  park:       { label: 'Park & Lake',     icon: 'Trees',         color: 'text-green-700 bg-green-100',  pinColor: '#15803d' },
  cultural:   { label: 'Cultural',        icon: 'Theater',       color: 'text-blue-700 bg-blue-100',    pinColor: '#1d4ed8' },
};
