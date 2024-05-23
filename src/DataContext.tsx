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

interface TotalData {
  [key: string]: any;
}

interface DataContextType {
  name: string;
  classData: any;
  loggedIn: boolean;
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
  version: string;
}

interface DataProviderProps {
  children: ReactNode;
}

const DataContext = createContext<DataContextType>({
  name: "Bob the Builder",
  classData: {},
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
  version: "1.0",
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

  const backendUrl = "https://grapes-backend-rewrite-production.up.railway.app";
  const version = "1.0";
  //const backendUrl = "http://127.0.0.1:5001";

  const totalGrades = useMemo(() => {
    if (!loggedIn) return [];
    let fin = [] as ClassData[];
    if (!curClassData || curClassData.length === 0) return fin;
    curClassData.forEach((curClass: any) => {
      let newTotalGrades = {} as ClassData;

      newTotalGrades["name"] = curClass["classData"]["Name"];

      let ATTotal = 0;
      let ATEarned = 0;
      let PPTotal = 0;
      let PPEarned = 0;

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
      });

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
  }, [curClassData]);

  const addAssignment = (index: number, assignment: any) => {
    let newClassData = JSON.parse(JSON.stringify(curClassData));
    // Add to beginning of array
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
      fetchMarkingPeriodData(newMPData, curMP);
    }
  }, [curMP, totalData]);

  const fetchMarkingPeriodData = async (mpData: any, curMP: string) => {
    setFetchingMPData(true);
    const r = await fetch(backendUrl + "/getmarkperiod?v=" + version, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cookies: cookies,
        classList: classData,
        markPeriodGU: mpData["markPeriodGU"],
        gradePeriodGU: mpData["gradePeriodGU"],
      }),
    });

    const rData = await r.json();

    if ("error" in rData) {
      throw new Error(rData["error"]);
    }

    if (!r.ok) {
      throw new Error(rData["Error occured while logging in."]);
    }

    var totalDataCopy = JSON.parse(JSON.stringify(totalData));

    totalDataCopy[curMP] = rData;
    setTotalData(totalDataCopy);
    setCurClassData(rData);
    setOriginalClassData(rData);

    setFetchingMPData(false);

    return rData;
  };

  return (
    <DataContext.Provider
      value={{
        name,
        classData,
        loggedIn,
        setName,
        setClassData,
        setLoggedIn,
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
        version,
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
