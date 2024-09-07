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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";

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
    markingPeriods,
    setMarkingPeriods,
    resetAssignments,
    fetchingMPData,
    version,
  } = useContext(DataContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const assignmentsFetch = async (data: any) => {
    if (loading) return;
    const mp = data.mp;
    if (mp === "" || !mp) {
      setLoading(true);
      const res = await fetch(backendUrl + "/getbasegradebook?v=" + version, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cookies: cookies }),
      });

      const rData = await res.json().catch(() => {
        throw new Error("Error occured while fetching grades in.");
      });

      if ("error" in rData) {
        throw new Error(rData["error"]);
      }
      if (!res.ok) {
        throw new Error(rData["Error occured while fetching grades in."]);
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
      assignmentsFetch({ mp: "" }).catch((e) => {
        setError(e.message);
        navigate("/");
      });
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
          {error && <p className="text-red-500">{error}</p>}
          <Button className="mb-4" onClick={() => resetAssignments()}>
            Reset
          </Button>
          {markingPeriods && (
            <Select
              value={curMP}
              onValueChange={(newMP) => setCurMP(newMP)}
              disabled={fetchingMPData || loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Loading Data..." />
              </SelectTrigger>
              <SelectContent>
                {markingPeriods
                  .filter(
                    (markingPeriod: any) =>
                      markingPeriod["Name"].includes("MP1") ||
                      markingPeriod["Name"].includes("MP2")
                  )
                  .map((markingPeriod: any, i: number) => (
                    <SelectItem key={i} value={markingPeriod["Name"]}>
                      {markingPeriod["Name"]}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mt-4">
            {loading || fetchingMPData ? (
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
          <div className="mb-8" />
          <AnnouncementText />
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
