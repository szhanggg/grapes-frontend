import { useContext, useEffect } from "react";
import DataContext, { ClassData } from "./DataContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import ClassCard from "./components/ClassCard";

function Dashboard() {
  const { name, loggedIn, totalGrades } = useContext(DataContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) navigate("/");
  }, []);

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>Grades</CardDescription>
        </CardHeader>
        <CardContent>
          {totalGrades.map((classData: ClassData, i) => (
            <ClassCard
              key={i}
              name={classData.name}
              grade={classData.grade}
              index={i}
            />
          ))}
        </CardContent>
        <Footer />
      </Card>
    </div>
  );
}

export default Dashboard;
