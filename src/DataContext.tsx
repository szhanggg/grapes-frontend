import {
  createContext,
  useState,
  ReactNode,
  useMemo,
  SetStateAction,
  Dispatch,
} from "react";

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
}

const colorGrade = (grade: number) => {
  if (grade >= 89.5) {
    return "text-green-500";
  } else if (grade >= 79.5) {
    return "text-blue-500";
  } else if (grade >= 69.5) {
    return "text-yellow-500";
  } else if (grade >= 59.5) {
    return "text-orange-500";
  } else {
    return "text-red-500";
  }
};

export const DataProvider = ({ children }: DataProviderProps) => {
  const [name, setName] = useState("Bob the Builder");
  const [classData, setClassData] = useState([] as any);
  const [originalClassData, setOriginalClassData] = useState([] as any);
  const [loggedIn, setLoggedIn] = useState(false);
  const [counter, setCounter] = useState(0);

  const totalGrades = useMemo(() => {
    if (!loggedIn) return [];
    let fin = [] as ClassData[];
    classData.forEach((curClass: any) => {
      let curClassData = {} as ClassData;
      // Delete the word containing SEC
      let secIndex = curClass.className.indexOf("SEC");
      if (secIndex !== -1) {
        curClassData["name"] = curClass.className.slice(0, secIndex - 1);
      } else {
        curClassData["name"] = curClass.className;
      }
      // Loop through classData[i].assignments
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

      curClassData["ATGrade"] = ATGrade;
      curClassData["PPGrade"] = PPGrade;
      curClassData["grade"] = grade;
      curClassData["ATTotal"] = ATTotal;
      curClassData["ATEarned"] = ATEarned;
      curClassData["PPTotal"] = PPTotal;
      curClassData["PPEarned"] = PPEarned;
      curClassData["color"] = colorGrade(grade);

      fin.push(curClassData);
    });
    return fin;
  }, [classData]);

  const addAssignment = (index: number, assignment: any) => {
    let newClassData = JSON.parse(JSON.stringify(classData));
    // Add to beginning of array
    newClassData[index].assignments.unshift(assignment);
    setClassData(newClassData);
  };

  const editAssignment = (
    index: number,
    assignmentIndex: number,
    assignment: any
  ) => {
    let newClassData = JSON.parse(JSON.stringify(classData));
    newClassData[index].assignments[assignmentIndex] = assignment;
    setClassData(newClassData);
  };

  const deleteAssignment = (index: number, assignmentIndex: number) => {
    let newClassData = JSON.parse(JSON.stringify(classData));
    newClassData[index].assignments.splice(assignmentIndex, 1);
    setClassData(newClassData);
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
