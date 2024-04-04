import { ModeToggle } from "./ModeToggle";

export const NavBar = () => {
  return (
    <nav className="flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold">Grapes</h1>
      <ModeToggle />
    </nav>
  );
};
