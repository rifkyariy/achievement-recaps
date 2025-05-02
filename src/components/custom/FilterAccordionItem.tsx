import { AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Palette } from "lucide-react";

interface FilterAccordionItemProps {
  title: string;
  icon: React.ReactNode;
  filterKey: keyof DataFilter;
  filterList: string[];
  filters: string[];
  handleFilterChange: (filter: keyof DataFilter, value: string[]) => void;
}

const FilterAccordionItem = ({
  title,
  icon,
  filterKey,
  filterList,
  filters,
  handleFilterChange,
}: FilterAccordionItemProps) => {
  // Function to handle badge click logic
  const changeFilterBadge = (item: string) => {
    console.log("Clicked item:", filters);


    if (item === "All") {
      handleFilterChange(filterKey, ["All"]);
    } else {

      handleFilterChange(filterKey, [
        ...filters.filter((filter) => filter !== item),
        item,
      ]);
    }
  };

  return (
    <div>
      <AccordionTrigger className="hover:!no-underline cursor-pointer hover:text-gray-800">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {/* Category Select / Multiple Selection with Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {filterList.map((item, index) => (
            <Badge
              key={index}
              variant={filters.includes(item) ? "filled" : "outline"}
              onClick={() => changeFilterBadge(item)} // Use changeFilterBadge function on click
              className={`cursor-pointer px-4 py-2 rounded-full text-sm transition-all ease-in-out duration-300 ${filters.includes(item) ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
            >
              {item === "All" ? "Semua " + title : item}
              {filters.includes(item) && (
                <span className="ml-2 text-xs text-gray-500">✓</span>
              )}
            </Badge>
          ))}
        </div>

        {/* Clear All Button */}
        <div className="text-right">
          <button
            className="text-sm text-blue-500 hover:text-blue-700"
            onClick={() => handleFilterChange(filterKey, ["All"])} // Clear all on click
          >
            Clear All
          </button>
        </div>
      </AccordionContent>
    </div>
  );
};

export default FilterAccordionItem;
