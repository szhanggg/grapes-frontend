import { Button } from "./ui/button";
import { TableCell, TableRow } from "./ui/table";
import { useState, useRef, useEffect } from "react";

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
  const [type, setType] = useState(assignment.assignmentType);
  const [earned, setEarned] = useState(assignment.points);
  const [total, setTotal] = useState(assignment.pointsPossible);

  // Inside your component
  const [isEditing, setIsEditing] = useState({
    earned: false,
    total: false,
  });

  const earnedRef = useRef<HTMLInputElement>(null);
  const totalRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing.earned) {
      earnedRef.current?.focus();
    } else if (isEditing.total) {
      totalRef.current?.focus();
    }
  }, [isEditing]);

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
      <TableCell className="hidden md:block">
        {assignment.date.slice(0, assignment.date.indexOf("-") - 1)}
      </TableCell>
      <TableCell>{assignment.title}</TableCell>
      <TableCell>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="All Tasks / Assessments">AT</option>
          <option value="Practice / Preparation">PP</option>
        </select>
      </TableCell>
      <TableCell>
        {isEditing.earned ? (
          <input
            value={earned}
            onChange={(e) => setEarned(e.target.value)}
            onBlur={() => setIsEditing((prev) => ({ ...prev, earned: false }))}
            ref={earnedRef}
            size={earned.length || 1}
          />
        ) : (
          <span
            onClick={() => setIsEditing((prev) => ({ ...prev, earned: true }))}
          >
            {earned === "" ? "?" : earned}
          </span>
        )}
        /
        {isEditing.total ? (
          <input
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            onBlur={() => setIsEditing((prev) => ({ ...prev, total: false }))}
            ref={totalRef}
            size={total.length || 1}
          />
        ) : (
          <span
            onClick={() => setIsEditing((prev) => ({ ...prev, total: true }))}
          >
            {total === "" ? "?" : total}
          </span>
        )}
      </TableCell>
    </TableRow>
  );
};

export default Assignment;
