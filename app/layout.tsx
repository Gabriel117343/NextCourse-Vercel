import "./ui/global.css";
import { montserrat, inter } from "@app/ui/fonts";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}
        {/* <footer className="py-10 flex justify-center items-center bg-black w-full h-[200] absolute bottom-0">
          
          <strong className="text-white">Hecho con -</strong> </footer> */}
      </body>
    </html>
  );
}
