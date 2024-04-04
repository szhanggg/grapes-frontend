import { createContext, useState, ReactNode, useMemo } from "react";

interface DataContextType {
  name: string;
  classData: any;
  loggedIn: boolean;
  setName: (name: string) => void;
  setClassData: (classData: any) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  totalGrades: ClassData[];
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
});

export interface ClassData {
  name: string;
  ATGrade: number;
  PPGrade: number;
  grade: number;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [name, setName] = useState("Bob the Builder");
  const [classData, setClassData] = useState([] as any);
  const [loggedIn, setLoggedIn] = useState(false);

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

      curClassData["ATGrade"] = ATGrade;
      curClassData["PPGrade"] = PPGrade;
      curClassData["grade"] = grade;

      fin.push(curClassData);
    });
    return fin;
  }, [classData]);

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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
