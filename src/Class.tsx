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
import { NavBar } from "./components/NavBar";
import { CardWrapper } from "./components/CardWrapper";
import { colorGrade, letterGrade } from "./lib/utils";

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
    setClassData,
    originalClassData,
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
      <NavBar />
      {curClassGrades && (
        <Card className="w-min md:w-full">
          <CardHeader>
            <CardTitle>
              <h1>{curClassGrades?.name}</h1>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <CardWrapper>
              <div className="flex justify-between w-full gap-12 items-center">
                <div
                  className={
                    "flex flex-col items-center " +
                    colorGrade(curClassGrades.ATGrade)
                  }
                >
                  <p className="text-gray-400">AT</p>
                  <h1 className="font-bold text-4xl">
                    {letterGrade(curClassGrades.ATGrade)}
                  </h1>
                  <h2 className="text-sm font-semibold">
                    {curClassGrades.ATGrade}
                  </h2>
                  <h2 className="text-sm">
                    {curClassGrades.ATEarned}/{curClassGrades.ATTotal}
                  </h2>
                </div>
                <div
                  className={
                    "flex flex-col items-center " +
                    colorGrade(curClassGrades.grade)
                  }
                >
                  <p className="text-gray-400">Total</p>
                  <h1 className="font-bold text-7xl">
                    {letterGrade(curClassGrades.grade)}
                  </h1>
                  <h2 className="text-xl font-semibold">
                    {curClassGrades.grade}
                  </h2>
                </div>
                <div
                  className={
                    "flex flex-col items-center " +
                    colorGrade(curClassGrades.PPGrade)
                  }
                >
                  <p className="text-gray-400">PP</p>
                  <h1 className="font-bold text-4xl">
                    {letterGrade(curClassGrades.PPGrade)}
                  </h1>
                  <h2 className="text-sm font-semibold">
                    {curClassGrades.PPGrade}
                  </h2>
                  <h2 className="text-sm">
                    {curClassGrades.PPEarned}/{curClassGrades.PPTotal}
                  </h2>
                </div>
              </div>
            </CardWrapper>
            <CardWrapper>
              <div className="flex justify-between w-full">
                <Button
                  onClick={() => {
                    setClassData(JSON.parse(JSON.stringify(originalClassData)));
                  }}
                >
                  Reset
                </Button>
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
                  +
                </Button>
              </div>
              <Table className="w-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead className="mx-0"></TableHead>
                    <TableHead className="w-32 hidden md:table-cell">
                      Date
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {curClassData?.assignments.map(
                    (assignment: any, i: number) => (
                      <Assignment
                        key={
                          assignment.title +
                          assignment.date +
                          curClassGrades?.name
                        }
                        assignmentIndex={i}
                        classIndex={parseInt(index ? index : "0")}
                        assignment={assignment}
                        editAssignment={editAssignment}
                        deleteAssignment={deleteAssignment}
                      />
                    )
                  )}
                </TableBody>
              </Table>
            </CardWrapper>
          </CardContent>
          <Footer />
        </Card>
      )}
    </div>
  );
};

export default Class;
