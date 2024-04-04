import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type ClassCardProps = {
  name: string;
  grade: number;
  index: number;
};

const colorGrade = (grade: number) => {
  if (grade >= 89.5) {
    return "text-green-500";
  } else if (grade >= 79.5) {
    return "text-blue-500";
  } else if (grade >= 69.5) {
    return "text-yellow-500";
  } else if (grade >= 59.5) {
    return "text-orange-500";
  } else {
    return "text-red-500";
  }
};

export const ClassCard = ({ name, grade, index }: ClassCardProps) => {
  return (
    <Link to={`/class/${index}`}>
      <Card>
        <CardHeader>
          <CardTitle>
            {name} <span className={colorGrade(grade)}>{grade}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </Link>
  );
};

export default ClassCard;
