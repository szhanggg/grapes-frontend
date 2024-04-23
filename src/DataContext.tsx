import {
  createContext,
  useState,
  ReactNode,
  useMemo,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { colorGrade } from "./lib/utils";
import { io, Socket } from 'socket.io-client';

interface TotalData {
  [key: string]: any;
}

interface DataContextType {
  name: string;
  classData: any;
  loggedIn: boolean;
  socket: Socket | null;
  setName: (name: string) => void;
  setClassData: (classData: any) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  totalGrades: ClassData[];
  originalClassData: any;
  setOriginalClassData: (originalClassData: any) => void;
  addAssignment: (index: number, assignment: any) => void;
  editAssignment: (
    index: number,
    assignmentIndex: number,
    assignment: any
  ) => void;
  deleteAssignment: (index: number, assignmentIndex: number) => void;
  counter: number;
  setCounter: Dispatch<SetStateAction<number>>;
  totalData: TotalData;
  setTotalData: Dispatch<SetStateAction<TotalData>>;
  markingPeriods: any;
  setMarkingPeriods: Dispatch<SetStateAction<any>>;
  curMP: string;
  setCurMP: Dispatch<SetStateAction<string>>;
  backendUrl: string;
  cookies: any;
  setCookies: Dispatch<SetStateAction<any>>;
  curClassData: any;
  setCurClassData: Dispatch<SetStateAction<any>>;
  resetAssignments: () => void;
  fetchingMPData: boolean;
  setFetchingMPData: Dispatch<SetStateAction<boolean>>;
  assignmentsLoading: boolean[];
  setAssignmentsLoading: Dispatch<SetStateAction<boolean[]>>;

}

interface DataProviderProps {
  children: ReactNode;
}

const DataContext = createContext<DataContextType>({
  name: "Bob the Builder",
  classData: {},
  socket: null,
  loggedIn: false,
  setName: () => {},
  setClassData: () => {},
  setLoggedIn: () => {},
  totalGrades: [],
  originalClassData: {},
  setOriginalClassData: () => {},
  addAssignment: () => {},
  editAssignment: () => {},
  deleteAssignment: () => {},
  counter: 1,
  setCounter: () => {},
  totalData: {},
  setTotalData: () => {},
  markingPeriods: [],
  setMarkingPeriods: () => {},
  curMP: "",
  setCurMP: () => {},
  backendUrl: "",
  cookies: {},
  setCookies: () => {},
  curClassData: {},
  setCurClassData: () => {},
  resetAssignments: () => {},
  fetchingMPData: false,
  setFetchingMPData: () => {},
  assignmentsLoading: [],
  setAssignmentsLoading: () => {},

});

export interface ClassData {
  name: string;
  ATGrade: number;
  ATTotal: number;
  ATEarned: number;
  PPGrade: number;
  PPTotal: number;
  PPEarned: number;
  grade: number;
  color: string;
  teacher: string;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [name, setName] = useState("Bob the Builder");
  const [classData, setClassData] = useState([] as any);
  const [originalClassData, setOriginalClassData] = useState([] as any);
  const [totalData, setTotalData] = useState<TotalData>({});
  const [markingPeriods, setMarkingPeriods] = useState([] as any[]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [counter, setCounter] = useState(0);
  const [curMP, setCurMP] = useState<string>("");
  const [cookies, setCookies] = useState({});
  const [curClassData, setCurClassData] = useState([] as any);
  const [fetchingMPData, setFetchingMPData] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [assignmentsLoading, setAssignmentsLoading] = useState<boolean[]>([]);
  const backendUrl = "https://grapessocket-production.up.railway.app";
  //const backendUrl = "http://127.0.0.1:5001";

  const totalGrades = useMemo(() => {
    if (!loggedIn) return [];
    let fin = [] as ClassData[];
    if (!curClassData) return fin;
    curClassData.forEach((curClass: any) => {
      let newTotalGrades = {} as ClassData;
  
      newTotalGrades["name"] = curClass["classData"]["Name"];
  
      let ATTotal = 0;
      let ATEarned = 0;
      let PPTotal = 0;
      let PPEarned = 0;

      if (!curClass.assignments) {
        ATTotal += parseFloat("-20.0");
        ATEarned += parseFloat("12.0");
      } else if (curClass.assignments.length > 0) {
        curClass.assignments.forEach((assignment: any) => {
          if (assignment.points === "") return;
          if (assignment.pointsPossible === "") return;
          if (assignment.assignmentType === "All Tasks / Assessments") {
            ATTotal += parseFloat(assignment.pointsPossible);
            ATEarned += parseFloat(assignment.points);
          } else {
            PPTotal += parseFloat(assignment.pointsPossible);
            PPEarned += parseFloat(assignment.points);
          }

      });}








      let ATGrade = ATEarned / ATTotal;
      let PPGrade = PPEarned / PPTotal;
      let grade = NaN;

      if (isNaN(ATGrade)) {
        grade = PPGrade;
      } else if (isNaN(PPGrade)) {
        grade = ATGrade;
      } else if (!isNaN(PPGrade) && !isNaN(ATGrade)) {
        grade = 0.9 * ATGrade + 0.1 * PPGrade;
      }

      // Multiply by 100 and round to 2 decimal places

      ATGrade = Math.round(ATGrade * 10000) / 100;
      PPGrade = Math.round(PPGrade * 10000) / 100;
      grade = Math.round(grade * 10000) / 100;
      ATTotal = Math.round(ATTotal * 100) / 100;
      ATEarned = Math.round(ATEarned * 100) / 100;
      PPTotal = Math.round(PPTotal * 100) / 100;
      PPEarned = Math.round(PPEarned * 100) / 100;

      newTotalGrades["ATGrade"] = ATGrade;
      newTotalGrades["PPGrade"] = PPGrade;
      newTotalGrades["grade"] = grade;
      newTotalGrades["ATTotal"] = ATTotal;
      newTotalGrades["ATEarned"] = ATEarned;
      newTotalGrades["PPTotal"] = PPTotal;
      newTotalGrades["PPEarned"] = PPEarned;
      newTotalGrades["color"] = colorGrade(grade);
      newTotalGrades["teacher"] = curClass["classData"]["teacher"];

      fin.push(newTotalGrades);
    });
    return fin;
  }, [loggedIn, curClassData]);

  const addAssignment = (index: number, assignment: any) => {
    let newClassData = JSON.parse(JSON.stringify(curClassData));
  
    newClassData[index].assignments.unshift(assignment);
    setCurClassData(newClassData);
  };

  const editAssignment = (
    index: number,
    assignmentIndex: number,
    assignment: any
  ) => {
    let newClassData = JSON.parse(JSON.stringify(curClassData));
    newClassData[index].assignments[assignmentIndex] = assignment;
    setCurClassData(newClassData);
  };

  const deleteAssignment = (index: number, assignmentIndex: number) => {
    let newClassData = JSON.parse(JSON.stringify(curClassData));
    newClassData[index].assignments.splice(assignmentIndex, 1);
    setCurClassData(newClassData);
  };

  const resetAssignments = () => {
    setCurClassData(JSON.parse(JSON.stringify(originalClassData)));
    document.dispatchEvent(new Event('reset'));
    console.log("reset")
  };
  
  useEffect(() => {
    if (!socket) return;
  
    socket.on('assignments', (rData: any) => {
      setTotalData((prevData) => ({
        ...prevData,
        [curMP]: prevData[curMP].map((classData: any, index: number) => {
          if (index === rData.classIndex) {
            setAssignmentsLoading((prevLoading) => {
              const updatedLoading = [...prevLoading];
              updatedLoading[rData.classIndex] = false;
              return updatedLoading;
            });
            return {
              ...classData,
              assignments: rData.assignments,
            };
          }
          return classData;
        }),
      }));
    });
  
    return () => {
      socket.off('assignments');
    };
  }, [socket, curMP]);

  useEffect(() => {
    if (curMP in totalData) {
      setCurClassData(totalData[curMP]);
      setOriginalClassData(totalData[curMP]);
    } else {
      if (curMP === "") return;
      if (fetchingMPData) return;
      var newMPData = {} as any;
      for (let mp of markingPeriods) {
        if (mp["Name"] === curMP) {
          newMPData = mp;
          break;
        }
      }
      fetchMarkingPeriodData(newMPData);
    }
  }, [curMP, totalData]);

  useEffect(() => {
    const newSocket = io(backendUrl);
    setSocket(newSocket);
  
    return () => {
      newSocket.disconnect();
    };
  }, [backendUrl]);

  const fetchMarkingPeriodData = async (mpData: any) => {
    setFetchingMPData(true);
    socket?.emit('getmarkperiod', {
      cookies: cookies,
      classList: classData,
      markPeriodGU: mpData["markPeriodGU"],
      gradePeriodGU: mpData["gradePeriodGU"],
    });
  };

  useEffect(() => {
    if (!socket) return;
  
    socket.on('markperiod', (rData: any) => {
      if ("error" in rData) {
        console.error(rData["error"]);
      } else {
        var totalDataCopy = JSON.parse(JSON.stringify(totalData));
        totalDataCopy[curMP] = rData;
        setTotalData(totalDataCopy);
        setCurClassData(rData);
        setOriginalClassData(rData);
        setFetchingMPData(false);
      }
    });
  
    return () => {
      socket.off('markperiod');
    };
  }, [socket, totalData, curMP]);

  return (
    <DataContext.Provider
      value={{
        name,
        classData,
        loggedIn,
        setName,
        setClassData,
        setLoggedIn,
        assignmentsLoading,
        setAssignmentsLoading,
        socket,
        totalGrades,
        originalClassData,
        setOriginalClassData,
        addAssignment,
        editAssignment,
        deleteAssignment,
        counter,
        setCounter,
        totalData,
        setTotalData,
        markingPeriods,
        setMarkingPeriods,
        curMP,
        setCurMP,
        backendUrl,
        cookies,
        setCookies,
        curClassData,
        setCurClassData,
        resetAssignments,
        fetchingMPData,
        setFetchingMPData,
        
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
