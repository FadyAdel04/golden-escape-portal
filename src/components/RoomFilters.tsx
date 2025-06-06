
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Filter, ChevronDown, X } from "lucide-react";

export interface RoomFilters {
  search: string;
  priceRange: [number, number];
  numberOfGuests: number | null;
  facilities: string[];
  viewType: string | null;
}

interface RoomFiltersProps {
  filters: RoomFilters;
  onFiltersChange: (filters: RoomFilters) => void;
  onReset: () => void;
}

const RoomFiltersComponent = ({ filters, onFiltersChange, onReset }: RoomFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const facilityOptions = [
    "Wi-Fi",
    "Air Conditioning", 
    "Mini Bar",
    "Room Service",
    "Balcony",
    "Jacuzzi",
    "TV",
    "Coffee Machine"
  ];

  const viewOptions = [
    "Sea View",
    "Mountain View", 
    "Garden View",
    "City View",
    "Pool View"
  ];

  const updateFilters = (key: keyof RoomFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleFacility = (facility: string) => {
    const newFacilities = filters.facilities.includes(facility)
      ? filters.facilities.filter(f => f !== facility)
      : [...filters.facilities, facility];
    updateFilters('facilities', newFacilities);
  };

  const hasActiveFilters = 
    filters.search || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 1000 ||
    filters.numberOfGuests !== null ||
    filters.facilities.length > 0 ||
    filters.viewType !== null;

  return (
    <div className="bg-white border rounded-lg p-4 mb-8 shadow-sm">
      {/* Search Bar - Always Visible */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search rooms..."
          className="pl-10"
          value={filters.search}
          onChange={(e) => updateFilters('search', e.target.value)}
        />
      </div>

      {/* Collapsible Filters */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onReset}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>

        <CollapsibleContent className="space-y-6 mt-4">
          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Price Range (per night)
            </Label>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilters('priceRange', value as [number, number])}
                max={1000}
                min={0}
                step={50}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Number of Guests */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Number of Guests
            </Label>
            <Select 
              value={filters.numberOfGuests?.toString() || "any"} 
              onValueChange={(value) => updateFilters('numberOfGuests', value === "any" ? null : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any number of guests" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any number of guests</SelectItem>
                <SelectItem value="1">1 Guest</SelectItem>
                <SelectItem value="2">2 Guests</SelectItem>
                <SelectItem value="3">3 Guests</SelectItem>
                <SelectItem value="4">4 Guests</SelectItem>
                <SelectItem value="5">5+ Guests</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Facilities */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Facilities
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {facilityOptions.map((facility) => (
                <div key={facility} className="flex items-center space-x-2">
                  <Checkbox
                    id={facility}
                    checked={filters.facilities.includes(facility)}
                    onCheckedChange={() => toggleFacility(facility)}
                  />
                  <Label htmlFor={facility} className="text-sm cursor-pointer">
                    {facility}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* View Type */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              View Type
            </Label>
            <Select 
              value={filters.viewType || "any"} 
              onValueChange={(value) => updateFilters('viewType', value === "any" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any view</SelectItem>
                {viewOptions.map((view) => (
                  <SelectItem key={view} value={view}>
                    {view}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default RoomFiltersComponent;
