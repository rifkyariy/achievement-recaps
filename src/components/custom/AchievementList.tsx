import { useEffect, useState } from "react";
import { toCamelCase } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, CircleDashed } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Row {
  student_name: string;
  type: string;
  class: string;
  subclass: string;
  category: string;
  competition_type: string;
  competition_status: string;
  competition_fullname: string;
  competition_level: string;
  competition_region: string;
  competition_organizer: string;
  competition_start_date: string;
  competition_end_date: string;
  competition_supervisor_type: string;
  competition_supervisor_name: string;
  competition_appreciation: string;
}

const COLUMNS = [
  { key: "student_name", label: "Nama Siswa" },
  { key: "type", label: "Jenjang" },
  { key: "class_subclass", label: "Kelas" },
  { key: "category", label: "Kategori" },
  { key: "competition_type", label: "Tipe Kompetisi" },
  { key: "competition_status", label: "Status" },
  { key: "competition_fullname", label: "Nama Kompetisi" },
  { key: "competition_level", label: "Tingkatan" },
  { key: "competition_region", label: "Region" },
  { key: "competition_organizer", label: "Penyelenggara" },
  { key: "competition_start_end_date", label: "Tanggal" },
  { key: "competition_supervisor_type", label: "Bimbingan" },
  { key: "competition_supervisor_name", label: "Nama Pembimbing" },
  { key: "competition_appreciation", label: "Apresiasi" },
];

const monthMap: { [key: string]: number } = {
  Januari: 0,
  Februari: 1,
  Maret: 2,
  April: 3,
  Mei: 4,
  Juni: 5,
  Juli: 6,
  Agustus: 7,
  September: 8,
  Oktober: 9,
  November: 10,
  Desember: 11,
};

const tailwindColors = [
  "red-500",
  "blue-500",
  "green-500",
  "yellow-500",
  "purple-500",
  "pink-500",
  "indigo-500",
  "teal-500",
  "orange-500",
  "gray-500",
  "lime-500",
  "emerald-500",
  "cyan-500",
  "rose-500",
  "slate-500",
  "violet-500",
];

const generateColorFromValue = (value: string): string => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  const colorIndex = Math.abs(hash) % tailwindColors.length;
  return `var(--color-${tailwindColors[colorIndex]})`;
};

const formatNameInitial = (name: string): string => {
  const names = name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return names[0][0].toUpperCase();
}

export default function AchievementList() {
  const [yearList, setYearList] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
    key: "student_name",
    direction: "asc",
  });
  const [filter, setFilter] = useState<string>("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    COLUMNS.slice(0, 14).map((col) => col.key)
  );
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const [perPage, setPerPage] = useState(10); // Items per page
  const [currentPage, setCurrentPage] = useState(1); // Current page

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.toLowerCase());
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key)
        ? prev.filter((col) => col !== key)
        : [...prev, key]
    );
  };

  const parseDate = (dateStr: string): number => {
    const dateParts = dateStr.split(" ");
    const day = parseInt(dateParts[0], 10);
    const month = monthMap[dateParts[1]] || 0;
    const year = parseInt(dateParts[2], 10);
    return new Date(year, month, day).getTime();
  };

  const getSortedData = () => {
    return [...data].sort((a, b) => {
      const aValue = String(a[sortConfig.key as keyof Row] || "");
      const bValue = String(b[sortConfig.key as keyof Row] || "");

      if (sortConfig.key.includes("date")) {
        const aDateRange = aValue.split(" - ");
        const bDateRange = bValue.split(" - ");

        const aDateObj = aDateRange.length > 1 ? parseDate(aDateRange[0]) : parseDate(aValue);
        const bDateObj = bDateRange.length > 1 ? parseDate(bDateRange[0]) : parseDate(bValue);

        return sortConfig.direction === "asc"
          ? aDateObj - bDateObj
          : bDateObj - aDateObj;
      }

      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  };

  const getFilteredData = () => {
    const sortedData = getSortedData();

    if (!filter) return sortedData;

    return sortedData.filter((row) =>
      Object.entries(row).some(([key, value]) =>
        String(value).toLowerCase().includes(filter)
      )
    );
  };

  const fetchData = async () => {
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
        const rows = json.values.slice(1).map((row) => ({
          student_name: row[0] || "",
          type: row[1] || "",
          class_subclass: `${row[2] || ""}${row[3] || ""}`,
          category: row[4] || "",
          competition_type: row[5] || "",
          competition_status: row[6] || "",
          competition_fullname: row[7] || "",
          competition_level: row[8] || "",
          competition_region: row[9] || "",
          competition_organizer: row[10] || "",
          competition_start_end_date: formatCombinedDate(row[11], row[12]),
          competition_supervisor_type: row[13] || "",
          competition_supervisor_name: row[14] || "",
          competition_appreciation: row[15] || "",
        }));

        // // Apply a filter based on selectedYear
        // const filteredRows = rows.filter((row) => {
        //   // Assuming you have a column with the year, modify accordingly if not
        //   const yearFromData = String(new Date(row.competition_start_end_date).getFullYear() || "");

        //   console.log("year from data:", yearFromData);
        //   console.log("selected year:", selectedYear);

        //   return yearFromData === selectedYear;
        // });

        // console.log("current year:", selectedYear);
        // console.log("Filtered rows:", filteredRows);

        setData(rows);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching spreadsheet data:", error);
      setError("Failed to load data. Please try again later.");
      setData([]);
    } finally {
      setLoading(false);
    }

  };

  const displayData = getFilteredData();

  const paginatedData = displayData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const totalPages = Math.ceil(displayData.length / perPage);

  const changePage = (page: number) => {
    setCurrentPage(page);
  };


  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearLength = currentYear - 2020 + 1;
    const years = Array.from(
      { length: yearLength },
      (_, index) => String(currentYear - index)
    ).reverse();

    // set year list and selected year
    setYearList(years);
    setSelectedYear(years[years.length - 1] || "");

  }, [selectedYear]);


  useEffect(() => {
    fetchData();
  }, []);



  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-xl font-bold">Achievement List</CardTitle>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search achievements..."
              className="pl-8 pr-4"
              value={filter}
              onChange={handleFilter}
            />
          </div>

          <Select value={selectedYear} onValueChange={(value) => setSelectedYear(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              {yearList.map((num) => (
                <SelectItem
                  key={num}
                  value={String(num)}
                >
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="whitespace-nowrap"
          >
            {showColumnSelector ? "Hide Columns" : "Select Columns"}
          </Button>
        </div>

        {showColumnSelector && (
          <div className="mt-4 bg-white p-4 border rounded-md shadow-sm">
            <div className="text-sm font-medium mb-2">Toggle Columns:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {COLUMNS.map((column) => (
                <div key={column.key} className="flex items-center">
                  <input
                    type="checkbox"
                    id={column.key}
                    checked={visibleColumns.includes(column.key)}
                    onChange={() => toggleColumn(column.key)}
                    className="mr-2"
                  />
                  <label htmlFor={column.key} className="text-sm">{column.label}</label>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-4 px-0">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50">
                {COLUMNS.filter((col) => visibleColumns.includes(col.key)).map((column) => (
                  <TableHead
                    key={column.key}
                    className="px-4 py-3 text-left font-medium text-sm cursor-pointer"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      <div className="ml-1">
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length} className="text-center py-8">
                    <div className="flex justify-center">
                      <CircleDashed className="h-4 w-4 text-primary-500 animate-spin" />
                    </div>
                    <div className="mt-2">Loading data...</div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length} className="text-center py-8 text-red-600">
                    {error}
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length} className="text-center py-8 text-gray-500">
                    {filter ? "No matching records found" : "No data available"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-gray-50 border-b">
                    {COLUMNS.filter((col) => visibleColumns.includes(col.key)).map((column) => {
                      const value = row[column.key as keyof Row];
                      return (
                        <TableCell key={column.key} className="px-4 py-3 text-sm">
                          {column.key === "category" || column.key === "competition_level" || column.key === "competition_supervisor_type" ? (
                            <div>
                              <Badge
                                style={{
                                  backgroundColor: generateColorFromValue(value),
                                }}
                                className="text-white mr-2"
                              >
                                {value}
                              </Badge>
                            </div>
                          ) : column.key.includes("date") ? (
                            value
                          ) : column.key === "competition_status" || column.key === "competition_region" ? (
                            toCamelCase(String(value))
                          ) : column.key === "student_name" ? (
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarFallback>
                                  {
                                    formatNameInitial(value)
                                  }
                                </AvatarFallback>
                              </Avatar>
                              <b>
                                {toCamelCase(value)}
                              </b>
                            </div>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex justify-between px-4 py-3 text-sm text-gray-500">

            <div>Page {currentPage} / {totalPages} | Showing {paginatedData.length} of {displayData.length} entries</div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => changePage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
