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
    socket,
    cookies,
    setTotalData,
    setClassData,
    setCurMP,
    curMP,
    markingPeriods,
    setMarkingPeriods,
    resetAssignments,
    fetchingMPData,
  } = useContext(DataContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { assignmentsLoading, setAssignmentsLoading } = useContext(DataContext);

  const assignmentsFetch = (data: any) => {
    if (loading) return;
    const mp = data.mp;
    if (mp === "" || !mp) {
      setLoading(true);
      socket?.emit('getbasegradebook', { cookies: cookies });
    } else {
      return;
    }
  };
  useEffect(() => {
    if (!socket) return;
  
    socket.on('basegradebook', (rData: any) => {
      console.log("classdata recieved", rData)
      if ("error" in rData) {
        setError(rData["error"]);
        navigate("/");
      } else {
        setCurMP(rData["currentMarkPeriod"]);
        setMarkingPeriods(rData["markPeriods"]);
        setClassData(rData["classData"]);
  
        const totalData = {
          [rData["currentMarkPeriod"]]: rData["currentMarkPeriodData"],
        };
  
        setTotalData(totalData);
        setAssignmentsLoading(new Array(rData["classData"].length).fill(true));
        setLoading(false);
      }
    });
  

  
    return () => {
      socket.off('basegradebook');
    };
  }, [socket, navigate, curMP]);

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
  }, [loggedIn, curMP, cookies, navigate]);

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
                      markingPeriod["Name"].includes("MP3") ||
                      markingPeriod["Name"].includes("MP4")
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
                  grade={assignmentsLoading[i] ? -60 : classData.grade}
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
