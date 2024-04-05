import { Link } from "react-router-dom";
import { ModeToggle } from "./ModeToggle";

type NavBarProps = {
  link: boolean | undefined;
};

export const NavBar = ({ link = false }: NavBarProps) => {
  return (
    <nav className="flex items-center justify-between p-4 pt-0">
      {link ? (
        <Link to="/dashboard">
          <h1 className="text-2xl font-bold">Grapes</h1>
        </Link>
      ) : (
        <h1 className="text-2xl font-bold">Grapes</h1>
      )}
      <ModeToggle />
    </nav>
  );
};
