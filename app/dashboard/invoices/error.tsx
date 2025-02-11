'use client';
 
import { useEffect } from 'react';

// Nota este componente captura todos los errores inesperados (o no controlados) en la aplicación a que llegen a entrar por el catch de un try/catch
// a menos que se capturen de manera controlada con componentes que pueden llamarse not-found.tsx o unauthorized.tsx, que manejarían casos específicos de error
// ver archivo not-found.tsx
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}