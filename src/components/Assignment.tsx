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
    if (isNaN(earned)) {
      setEarned("");
    }
    if (isNaN(total)) {
      setTotal("");
    }
    editAssignment(classIndex, assignmentIndex, {
      title: assignment.title,
      assignmentType: type,
      points: earned,
      pointsPossible: total,
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
      <TableCell>
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
            onChange={(e) => setEarned(parseFloat(e.target.value))}
            onBlur={() => setIsEditing((prev) => ({ ...prev, earned: false }))}
            ref={earnedRef}
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
            onChange={(e) => setTotal(parseFloat(e.target.value))}
            onBlur={() => setIsEditing((prev) => ({ ...prev, total: false }))}
            ref={totalRef}
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
