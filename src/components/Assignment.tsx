import { colorGrade } from "@/lib/utils";
import { Button } from "./ui/button";
import { TableCell, TableRow } from "./ui/table";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";

interface AssignmentProps {
  assignment: any;
  assignmentIndex: number;
  classIndex: number;
  editAssignment: (
    index: number,
    assignmentIndex: number,
    assignment: any
  ) => void;
  deleteAssignment: (index: number, assignmentIndex: number) => void;
}

const isNumber = (value: string) => {
  return !isNaN(parseFloat(value));
};
const formatNumber = (value: string) => {
  const numericv = parseFloat(value);
  if (!isNaN(numericv)) {
    if (numericv % 1 === 0) {  // Check if it's a whole number
      return String(Math.trunc(numericv));  // Convert float to truncated integer
    }
  }
  return value;
};



export const Assignment = ({
  assignment,
  assignmentIndex,
  classIndex,
  editAssignment,
  deleteAssignment,
}: AssignmentProps) => {
  const [type, setType] = useState<string>(assignment.assignmentType);
  const [earned, setEarned] = useState<string>(assignment.points);
  const [total, setTotal] = useState<string>(assignment.pointsPossible);

  useEffect(() => {
    editAssignment(classIndex, assignmentIndex, {
      title: assignment.title,
      assignmentType: type,
      points: isNumber(earned) ? earned : "",
      pointsPossible: isNumber(total) ? total : "",
      date: assignment.date,
    });
  }, [type, earned, total]);


  useEffect(() => {
    setType(assignment.assignmentType);
    setEarned(formatNumber(assignment.points));
    setTotal(formatNumber(assignment.pointsPossible));
  }, []);

  return (
    <TableRow>
      <TableCell className="hidden md:table-cell">
        <Button
          className="w-8 h-8 rounded-md"
          onClick={() => {
            deleteAssignment(classIndex, assignmentIndex);
          }}
        >
          X
        </Button>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {assignment.date.slice(0, assignment.date.indexOf("-") - 1)}
      </TableCell>
      <TableCell>{assignment.title}</TableCell>
      <TableCell>
        <Select value={type} onValueChange={(value) => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Test" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Tasks / Assessments">AT</SelectItem>
            <SelectItem value="Practice / Preparation">PP</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell
        className={`${
          isNumber(earned) && isNumber(total)
            ? colorGrade((parseFloat(earned) / parseFloat(total)) * 100)
            : "text-gray-500"
        } whitespace-nowrap`}
      >
        <Input
          value={earned}
          onBlur={(e) => setEarned(formatNumber(e.target.value))}
          onChange={(e) => setEarned(e.target.value.replace(/[^0-9.]/g, ""))}
          size={earned.length + 1 || 1}
          className="p-0 w-12 pl-2 inline-block"
        />
        <span className="mx-1 inline-block">/</span>
        <Input
          value={total}
          onBlur={(e) => setTotal(formatNumber(e.target.value))}
          onChange={(e) => setTotal(e.target.value.replace(/[^0-9.]/g, ""))} // Only allow numbers and decimals
          size={total.length + 1 || 1}
          className="p-0 w-12 pl-2 inline-block"
        />
      </TableCell>
    </TableRow>
  );
};

export default Assignment;
