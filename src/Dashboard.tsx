import { useContext, useEffect, useState } from "react";
import DataContext, { ClassData } from "./DataContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { useNavigate } from "react-router-dom";
import ClassCard from "./components/ClassCard";
import { Button } from "./components/ui/button";
import { NavBar } from "./components/NavBar";
import { ClassCardSkeleton } from "./components/ClassCardSkeleton";
import { AnnouncementText } from "./components/AnnouncementText";

function Dashboard() {
  const {
    name,
    loggedIn,
    totalGrades,
    backendUrl,
    cookies,
    setTotalData,
    setClassData,
    setCurMP,
    curMP,
    setMarkingPeriods,
    resetAssignments,
  } = useContext(DataContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const assignmentsFetch = async (data: any) => {
    if (loading) return;
    const mp = data.mp;
    if (mp === "" || !mp) {
      setLoading(true);
      const res = await fetch(backendUrl + "/getbasegradebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cookies: cookies }),
      });

      const rData = await res.json();
      if ("error" in rData) {
        throw new Error(rData["error"]);
      }
      if (!res.ok) {
        throw new Error(rData["Error occured while logging in."]);
      }

      setCurMP(rData["currentMarkPeriod"]);
      setMarkingPeriods(rData["markPeriods"]);
      setClassData(rData["classData"]);

      const totalData = {
        [rData["currentMarkPeriod"]]: rData["currentMarkPeriodData"],
      };

      setTotalData(totalData);
      setLoading(false);
    } else {
      return;
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    }

    if (
      (curMP === "" || !curMP) &&
      "ASP.NET_SessionId" in cookies &&
      "PVUE" in cookies &&
      "EES_PVUE" in cookies
    ) {
      assignmentsFetch({ mp: "" });
    }
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
          <AnnouncementText />
          <Button className="mb-4" onSubmit={() => resetAssignments()}>
            Reset
          </Button>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            {loading ? (
              <>
                {[...Array(9)].map((_, i) => (
                  <ClassCardSkeleton key={i} />
                ))}
              </>
            ) : (
              totalGrades.map((classData: ClassData, i) => (
                <ClassCard
                  key={i}
                  name={classData.name}
                  teacher={classData.teacher}
                  grade={classData.grade}
                  color={classData.color}
                  index={i}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
