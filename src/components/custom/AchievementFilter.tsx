// components/custom/AchievementFilter.tsx
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Calendar, Palette, Settings2 } from "lucide-react";
import FilterAccordionItem from "./FilterAccordionItem"; // Import the new component

interface DataFilter {
  year: string[];
  category: string[];
  status: string[];
  type: string[];
  level: string[];
  class: string[];
  organizer: string[];
  supervisorType: string[];
}

interface AchievementFilterProps {
  filterList: DataFilter;
  filters: DataFilter;
  handleFilterChange: (filter: keyof DataFilter, value: string[]) => void;
}

const AchievementFilter = ({ filterList, filters, handleFilterChange }: AchievementFilterProps) => {
  return (
    <div className="px-4">
      <div className="flex items-center gap-2 py-2">
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>

      <div className="w-full flex flex-wrap gap-4 items-start">
        <Accordion type="single" collapsible className="w-full">
          {/* Category Filter */}
          <AccordionItem value="item-1">
            <FilterAccordionItem
              title="Category"
              icon={<Palette width={20} />}
              filterKey="category"
              filterList={filterList.category}
              filters={filters.category}
              handleFilterChange={handleFilterChange}
            />
          </AccordionItem>

          {/* Year Filter */}
          <AccordionItem value="item-2">
            <FilterAccordionItem
              title="Year"
              icon={<Calendar width={20} />}
              filterKey="year"
              filterList={filterList.year}
              filters={filters.year}
              handleFilterChange={handleFilterChange}
            />
          </AccordionItem>

          {/* Add more AccordionItems for other filters (Status, Type, Level, etc.) */}
        </Accordion>
      </div>
    </div>
  );
};

export default AchievementFilter;
