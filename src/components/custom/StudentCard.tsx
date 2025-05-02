
// Shadcn UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Utility Functions
import { toCamelCase } from "@/lib/utils";


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

interface StudentCardProps {
  loading: boolean;
  error: string | null;
  data: Row[];
}
const StudentCard = ({ loading, error, data }: StudentCardProps) => {
  return (
    <div className="w-full  mt-4">
      {/* Loop data */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {data.map((row, index) => (
        <Card key={index} className="bg-white shadow-md rounded-lg">
          {/* Card Header with student image and name */}
          <CardHeader className="flex items-center">
            <Avatar className="w-16 h-16">
              <AvatarImage src="https://via.placeholder.com/150?text=${row.student_name}" alt="@shadcn" />
              <AvatarFallback className="bg-emerald-500">
                <span className="font-bold text-lg text-white">
                  {row.student_name.charAt(0).toUpperCase()}
                </span>
              </AvatarFallback>

            </Avatar>
            <div className="ml-4">
              <CardTitle className="text-xl font-semibold mb-1">{row.student_name}</CardTitle>
              <CardTitle className="text-l font-medium">{row.competition_type} - {row.competition_fullname}</CardTitle>

              <CardDescription className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline" className="text-sm">
                  {toCamelCase(row.competition_status)}

                </Badge>
                <Badge variant="outline" className="text-sm">
                  {row.type}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {row.class_subclass}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {row.category}

                </Badge>
              </CardDescription>
            </div>
          </CardHeader>


        </Card>
      ))}
    </div>
  );
};

export default StudentCard;