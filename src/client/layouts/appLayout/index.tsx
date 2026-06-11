import { Outlet } from "react-router";
import { Header } from "./components/header";

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 mt-14">
        <Outlet />
      </main>
    </div>
  );
}

export { AppLayout };
