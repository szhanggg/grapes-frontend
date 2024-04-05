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
import { Button } from "./components/ui/button";
import { NavBar } from "./components/NavBar";

function Dashboard() {
  const { name, loggedIn, totalGrades, setClassData, originalClassData } =
    useContext(DataContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) navigate("/");
  }, []);

  return (
    <div className="p-2 md:p-4">
      <NavBar link={true} />
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>Grades</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="mb-4"
            onClick={() =>
              setClassData(JSON.parse(JSON.stringify(originalClassData)))
            }
          >
            Reset
          </Button>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            {totalGrades.map((classData: ClassData, i) => (
              <ClassCard
                key={i}
                name={classData.name}
                grade={classData.grade}
                color={classData.color}
                index={i}
              />
            ))}
          </div>
        </CardContent>
        <Footer />
      </Card>
    </div>
  );
}

export default Dashboard;
