import { useNavigate, useParams } from "react-router-dom";
import DataContext from "./DataContext";
import { useContext, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import Footer from "./components/Footer";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import Assignment from "./components/Assignment";
import { Button } from "./components/ui/button";

export const Class = () => {
  const { index } = useParams();
  const {
    totalGrades,
    classData,
    loggedIn,
    addAssignment,
    editAssignment,
    deleteAssignment,
    counter,
    setCounter,
  } = useContext(DataContext);

  const navigate = useNavigate();

  const curClassGrades =
    index !== undefined ? totalGrades[parseInt(index)] : undefined;

  const curClassData =
    index !== undefined ? classData[parseInt(index)] : undefined;

  useEffect(() => {
    if (!index) navigate("/");
    if (!loggedIn) navigate("/");
  }, []);

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1>{curClassGrades?.name}</h1>
            <h1 className={curClassGrades?.color + " mt-4"}>
              {curClassGrades?.grade}%
            </h1>
            <h1>
              AT : {curClassGrades?.ATEarned}/{curClassGrades?.ATTotal} ={" "}
              {curClassGrades?.ATGrade}%
            </h1>
            <h1>
              PP : {curClassGrades?.PPEarned}/{curClassGrades?.PPTotal} ={" "}
              {curClassGrades?.PPGrade}%
            </h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              addAssignment(parseInt(index ? index : "0"), {
                title: `New Assignment ${counter}`,
                date: "N/A -",
                assignmentType: "All Tasks / Assessments",
                points: 0,
                pointsPossible: 0,
              });
              setCounter((counter: number) => counter + 1);
            }}
          >
            Add Assignment
          </Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="mx-0"></TableHead>
                <TableHead className="w-32 hidden md:block">Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {curClassData?.assignments.map((assignment: any, i: number) => (
                <Assignment
                  key={
                    assignment.title + assignment.date + curClassGrades?.name
                  }
                  assignmentIndex={i}
                  classIndex={parseInt(index ? index : "0")}
                  assignment={assignment}
                  editAssignment={editAssignment}
                  deleteAssignment={deleteAssignment}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <Footer />
      </Card>
    </div>
  );
};

export default Class;
