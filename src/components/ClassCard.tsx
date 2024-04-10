import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { letterGrade } from "@/lib/utils";

type ClassCardProps = {
  name: string;
  teacher: string;
  grade: number;
  index: number;
  color: string;
};

export const ClassCard = ({
  name,
  teacher,
  grade,
  index,
  color,
}: ClassCardProps) => {
  return (
    <Link to={`/class/${index}`}>
      <Card className="flex flex-col items-center justify-between h-full">
        <CardHeader className="flex flex-col items-center">
          <CardTitle>{name}</CardTitle>
          <CardDescription className="text-xl">{teacher}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-4">
          <h1 className={color + " font-bold text-4xl md:text-6xl"}>
            {letterGrade(grade)}
          </h1>
          <h1 className={color + " text-2xl"}>{grade}%</h1>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ClassCard;
