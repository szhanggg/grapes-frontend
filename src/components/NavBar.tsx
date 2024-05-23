import { Link } from "react-router-dom";
import { ModeToggle } from "./ModeToggle";
import { useContext } from "react";
import DataContext from "@/DataContext";

type NavBarProps = {
  link: boolean | undefined;
};

export const NavBar = ({ link = false }: NavBarProps) => {

  const { version } = useContext(DataContext);

  return (
    <nav className="flex items-center justify-between p-4 pt-0">
      <Link to={link ? "/dashboard" : "/"} className="flex flex-row">
        <img
          src="/grapes.png"
          alt="Grapes"
          className="h-8 mr-2"
          onError={(e) =>
            ((e.target as HTMLImageElement).style.display = "none")
          }
        />
        <div>
          <h1 className="text-2xl font-bold mr-2 inline">Grapes</h1>
          <span className="text-sm text-gray-500">v{version}</span>
        </div>
      </Link>
      <ModeToggle />
    </nav>
  );
};
