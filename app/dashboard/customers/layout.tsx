import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <h1>Layout de customers</h1> <section> <p><strong>Contenido de la página</strong></p>{children}</section>
    </div>
  );
};

export default layout;
