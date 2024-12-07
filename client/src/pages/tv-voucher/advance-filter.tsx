import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as Slider from '@radix-ui/react-slider';
import { DateRangePicker } from "./date-range-picker";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";

interface AdvancedFiltersProps {
  onFilterChange: (filters: any) => void;
}

const initialFilters: any = {
  cardNumber: "",
  productName: "",
  amountRange: [0, 100000],
  status: "",
  dateRange: undefined as DateRange | undefined,
};

export function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<{
    cardNumber: string;
    productName: string;
    amountRange: [number, number];
    status: string;
    dateRange: DateRange | undefined;
  }>(initialFilters);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Advanced Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={filters.cardNumber}
              onChange={(e) => handleFilterChange("cardNumber", e.target.value)}
              placeholder="Enter card number"
            />
          </div>
          <div>
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={filters.productName}
              onChange={(e) => handleFilterChange("productName", e.target.value)}
              placeholder="Enter product name"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-full">
            <Label htmlFor="amountRange">Amount Range</Label>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5 mt-2"
              value={filters.amountRange}
              onValueChange={(value) => handleFilterChange("amountRange", value)}
              min={0}
              max={100000}
              step={1000}
              aria-label="Amount range"
            >
              <Slider.Track className="bg-slate-200 relative grow rounded-full h-[3px]">
                <Slider.Range className="absolute bg-primary rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-slate-100 focus:outline-none focus:ring focus:ring-primary"
                aria-label="Min amount"
              />
              <Slider.Thumb
                className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-slate-100 focus:outline-none focus:ring focus:ring-primary"
                aria-label="Max amount"
              />
            </Slider.Root>
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>₱{filters.amountRange[0].toLocaleString()}</span>
              <span>₱{filters.amountRange[1].toLocaleString()}</span>
            </div>
          </div>
          <div className="col-span-full">
            <Label>Date Range</Label>
            <DateRangePicker
              onChange={(range: any) => handleFilterChange("dateRange", range)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 mt-6">
        <Button onClick={resetFilters} variant="outline">
          Reset Filters
        </Button>
        <Button onClick={applyFilters}>
          Apply Filters
        </Button>
      </CardFooter>
    </Card>
  );
}

