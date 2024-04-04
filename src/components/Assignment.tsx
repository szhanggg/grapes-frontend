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
      points: isNumber(earned) ? parseFloat(earned) : "",
      pointsPossible: isNumber(total) ? parseFloat(total) : "",
      date: assignment.date,
    });
  }, [type, earned, total]);

  return (
    <TableRow>
      <TableCell>
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
            : "text-red-500"
        } whitespace-nowrap`}
      >
        <Input
          value={earned}
          onChange={(e) => setEarned(e.target.value)}
          size={earned.length + 1 || 1}
          className="p-0 w-12 pl-2 inline-block"
        />
        <span className="mx-1 inline-block">/</span>
        <Input
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          size={total.length + 1 || 1}
          className="p-0 w-12 pl-2 inline-block"
        />
      </TableCell>
    </TableRow>
  );
};

export default Assignment;
