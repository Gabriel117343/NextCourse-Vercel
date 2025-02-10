import React from "react";
import SideNav from "../ui/dashboard/sidenav";
import { montserrat } from "../ui/fonts";
import { clsx } from "clsx";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const darkModeEnable = true;
  // nota  antialiased se agregando cuando se cargan fuente de google fonts para mejorar la calidad de la fuente en pantalla
  return (
    <>
      <header className="bg-blue-600 h-20 flex items-center justify-around text-white">
        <p
          className={clsx(
            `text-lg font-semibold antialiased ${montserrat.className}`,
            {
              "text-white": darkModeEnable,
              "text-black": !darkModeEnable,
            }
          )}
        >
          This can be the Header, that's would be rendered from the route /dashboard
        </p>
        <p>2025</p>
      </header>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64 bg-gray-100 ">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
