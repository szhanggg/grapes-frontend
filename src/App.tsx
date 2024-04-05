import LoginWrapper from "./components/LoginWrapper";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <div className="flex flex-col min-h-screen p-4">
      <NavBar link={false} />
      <div className="w-full flex items-start md:items-center justify-center flex-grow">
        <LoginWrapper />
      </div>
    </div>
  );
}

export default App;
