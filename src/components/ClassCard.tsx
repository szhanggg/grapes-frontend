import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type ClassCardProps = {
  name: string;
  grade: number;
  index: number;
  color: string;
};

export const ClassCard = ({ name, grade, index, color }: ClassCardProps) => {
  return (
    <Link to={`/class/${index}`}>
      <Card>
        <CardHeader>
          <CardTitle>
            {name} <span className={color}>{grade}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </Link>
  );
};

export default ClassCard;
