import React from "react";
import Head from "next/head";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>DocAIze</title>
      </Head>
      {/* Encabezado */}
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-center">DocAIze</h1>
      </header>
      <main>{children}</main>
    </>
  );
};

export default layout;
