"use client"

// React and Utils
import { use, useEffect, useState } from "react"
import { uniqueArray, toCamelCase, sortByValue } from "@/lib/utils"

// Next Image
import Image from "next/image"

// Shadcn UI Components
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


// Custom UI Components
import AchievementFilter from "@/components/custom/AchievementFilter"
import StudentCard from "@/components/custom/StudentCard"

// Lucide Icons
import { Search } from "lucide-react";

interface Row {
  student_name: string;
  type: string;
  class: string;
  subclass: string;
  class_subclass: string;
  category: string;
  competition_type: string;
  competition_status: string;
  competition_fullname: string;
  competition_region: string;
  competition_level: string;
  competition_organizer: string;
  competition_start_date: string;
  competition_end_date: string;
  competition_start_end_date: string;
  competition_supervisor_type: string;
  competition_supervisor_name: string;
  competition_appreciation: string;
}

interface DataFilter {
  year: string[];
  category: string[];
  status: string[];
  type: string[]
  level: string[];
  class: string[];
  organizer: string[];
  supervisorType: string[];
}

export default function Dashboard() {
  // State for data
  const [rawData, setRawData] = useState<Row[]>([]);
  const [data, setData] = useState<Row[]>(rawData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [filterList, setFilterList] = useState<DataFilter>({
    year: [],
    category: [],
    status: [],
    type: [],
    level: [],
    class: [],
    organizer: [],
    supervisorType: [],
  });
  const [filters, setFilters] = useState<DataFilter>({
    year: ["All"],
    category: ["All"],
    status: ["All"],
    type: ["All"],
    level: ["All"],
    class: ["All"],
    organizer: ["All"],
    supervisorType: ["All"]
  });

  // Function to handle all data fetching
  const getAllData = async () => {
    setLoading(true);
    setError(null);
    const spreadsheetId = "1PDQmDwSTNtsgJzfKaBCEbTe3fBSEUeplAiL3-GKviXA";
    const apiKey = "AIzaSyDzumKhspcAFvdD1alG3jAnxQ2cMPZG5wQ";
    const range = "DATA_ACHIEVEMENT!A1:P100000";

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    const formatCombinedDate = (startDate: string, endDate: string) => {
      if (startDate === endDate) {
        return startDate;
      }
      return `${startDate} - ${endDate}`;
    };

    try {
      const response = await fetch(url);
      const json = await response.json();

      if (json.values) {
        const rows = json.values.slice(1).map((row: string[]) => ({
          student_name: row[0] || "",
          type: row[1] || "",
          class: row[2] || "",
          subclass: row[3] || "",
          class_subclass: row[2] + " " + row[3],
          category: row[4] || "",
          competition_type: row[5] || "",
          competition_status: row[6] || "",
          competition_fullname: row[7] || "",
          competition_region: row[8] || "",
          competition_level: row[9] || "",
          competition_organizer: row[10] || "",
          competition_start_date: row[11] || "",
          competition_end_date: row[12] || "",
          competition_start_end_date: formatCombinedDate(row[11], row[12]),
          competition_supervisor_type: row[13] || "",
          competition_supervisor_name: row[14] || "",
          competition_appreciation: row[15] || "",
        }));

        setRawData(rows);

        // set filterList
        generateFilterList(rows);
      } else {
        setRawData([]);

        // set filterList

      }
    } catch (error) {
      console.error("Error fetching spreadsheet data:", error);
      setError("Failed to load data. Please try again later.");
      setRawData([]);
    } finally {
      setLoading(false);
    }

  }

  const generateFilterList = (data: Row[]) => {
    const filterList: DataFilter = {
      year: [],
      category: [],
      status: [],
      type: [],
      level: [],
      class: [],
      organizer: [],
      supervisorType: [],
    };

    // get unique values for each filter from rawData
    data.forEach((row) => {
      // get year from this kind of string 25 Juni 2024 - 30 Juni 2024
      const year = row.competition_start_end_date.split(" ")[2];

      filterList.year = sortByValue(uniqueArray([...filterList.year, year]));
      filterList.class = sortByValue(uniqueArray([...filterList.class, row.class]));
      filterList.category = sortByValue(uniqueArray([...filterList.category, row.category]));
      filterList.status = sortByValue(uniqueArray([...filterList.status, toCamelCase(row.competition_status)]));
      filterList.type = sortByValue(uniqueArray([...filterList.type, row.type]));
      filterList.level = sortByValue(uniqueArray([...filterList.level, row.competition_level]));
      filterList.organizer = sortByValue(uniqueArray([...filterList.organizer, row.competition_organizer]));
      filterList.supervisorType = sortByValue(uniqueArray([...filterList.supervisorType, row.competition_supervisor_type]));
    });

    // fill all filterList with "All" option
    filterList.year.unshift("All");
    filterList.category.unshift("All");
    filterList.status.unshift("All");
    filterList.type.unshift("All");
    filterList.level.unshift("All");
    filterList.class.unshift("All");
    filterList.organizer.unshift("All");
    filterList.supervisorType.unshift("All");

    setFilterList(filterList);
  };

  // Function to handle filter changes
  const handleFilterChange = (filter: keyof DataFilter, value: string) => {

    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: [value],
    }));
  }

  // Function to handle search and add debounce after 500ms
  const handleSearch = (search: string) => {
    setData(
      rawData.filter((row) =>
        Object.values(row).some((val) =>
          val.toString().toLowerCase().includes(search.toLowerCase())
        )
      )
    );
  };



  useEffect(() => {
    getAllData();
  }, []);

  // useEffect to handle URL params
  useEffect(() => {
    // check if url has params using convertURLParamsToFilter
    const urlParams = window.location.search;
    if (urlParams) {
      const newFilters = convertURLParamsToFilter(urlParams);
      setFilters(newFilters);
    }
  }, []);

  useEffect(() => {
    const filteredData = rawData.filter((row) => {
      console.log(row.competition_start_date.split(" ")[2], filters.year[0]);

      // if filters.year[0] is "All" or empty, don't filter by year
      const yearMatch = filters.year[0] === "All" || row.competition_start_date.split(" ")[2] === filters.year[0];
      const categoryMatch = filters.category[0] === "All" || row.category === filters.category[0];
      const statusMatch = filters.status[0] === "All" || toCamelCase(row.competition_status) === filters.status[0];
      const typeMatch = filters.type[0] === "All" || row.type === filters.type[0];
      const levelMatch = filters.level[0] === "All" || row.competition_level === filters.level[0];
      const classMatch = filters.class[0] === "All" || row.class === filters.class[0];
      const organizerMatch = filters.organizer[0] === "All" || row.competition_organizer === filters.organizer[0];
      const supervisorTypeMatch = filters.supervisorType[0] === "All" || row.competition_supervisor_type === filters.supervisorType[0];

      return yearMatch && categoryMatch && statusMatch && typeMatch && levelMatch && classMatch && organizerMatch && supervisorTypeMatch;
    });

    // convert filterList to URL params
    const params = convertFilterToURLParams(filters);
    const url = new URL(window.location.href);

    // if params is empty, remove it from URL
    if (params) {
      url.search = params;
    } else {
      url.search = "";
    }

    // set URL without reloading the page
    window.history.replaceState({}, "", url);

    // set data to filtered data
    setData(filteredData);
  }, [filters, rawData]);


  const convertFilterToURLParams = (filters: DataFilter) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value[0] !== "All") {
        params.append(key, value[0]);
      }
    });
    return params.toString();
  }

  const convertURLParamsToFilter = (url: string) => {
    const params = new URLSearchParams(url);
    const newFilters: DataFilter = {
      year: ["All"],
      category: ["All"],
      status: ["All"],
      type: ["All"],
      level: ["All"],
      class: ["All"],
      organizer: ["All"],
      supervisorType: ["All"]
    };
    params.forEach((value, key) => {
      if (key in newFilters) {
        newFilters[key as keyof DataFilter] = [value];
      }
    }
    );
    return newFilters;
  }

  return (
    <div className="w-full  mx-auto space-y-6 flex flex-col items-center">
      <div className="fixed top-0 bg-[#0054A3] z-10 shadow-md w-full">
        <div className="flex flex-row items-center gap-2 px-4 py-2 bg-[#0054A3]">
          <Image
            src="/assets/images/logo-alt.png"
            alt="No Data"
            width={80}
            height={80}
            quality={100}
            className="py-2"
          />

          <div className="py-2">
            <h1 className="text-2xl font-bold max-w-4xl text-white pl-2">
              Achievement List
            </h1>
          </div>
        </div>


      </div>

      <div className="fixed flex flex-row items-start gap-4 w-full ">
        <div className="w-full max-w-md h-screen left-0 right-0 z-10 bg-white shadow-md mt-20">
          {/* Filter Icon Lucide */}
          <div className="w-full flex flex-wrap gap-4 items-start  p-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search achievements..."
                className="pl-8 pr-4"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>


          </div>
          <AchievementFilter
            filterList={filterList}
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        </div>
        <div className="w-full mt-20 px-4">
          {/* Search Query or Filter Displayed */}
          <div className="flex flex-row items-center gap-2 py-2 ">
            <h2 className="text-lg font-semibold">Filter</h2>
            {Object.entries(filters).map(([key, value]) => {
              if (value[0] !== "All") {
                return (
                  <span key={key} className="text-sm bg-gray-200 px-2 py-1 rounded">
                    {key}: {value[0]}
                  </span>
                );
              }
              return null;
            })}
          </div>

          <div>
            {JSON.stringify(filters)}
          </div>
          <div className="h-screen  overflow-auto ">
            {/* validation */}
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            {/* empty state */}
            {data.length === 0 && !loading && !error && (
              <div className="flex justify-center items-center min-h-screen text-center">
                <div className="flex justify-center items-center flex-col">
                  <Image
                    src="/assets/images/achivement-empty-state.png"
                    alt="No Data"
                    width={150}
                    height={150}
                    className="mb-4"
                  />
                  <p>No Achievement Found</p>
                </div>
              </div>

            )}

            {/* loop data */}
            {data.map((row, index) => (
              <StudentCard key={index} loading={loading} error={error} data={[row]} />
            ))}
          </div>


        </div>
      </div>
    </div>

  )
}