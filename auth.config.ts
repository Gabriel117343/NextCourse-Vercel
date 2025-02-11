import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login', // a esta ruta se redirige si el usuario no está autenticado en lugar de redirigir a la página de inicio de sesión predeterminada
    
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) { 
      const isLoggedIn = !! auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // redirige a la página de inicio de sesión si el usuario no está autenticado
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl)) // si ya esta logedo pero esta en una página que no es el dashboard, redirige al dashboard por defecto
      }
      return true
    }
  },
  providers: [] // opciones de login: pueden ser google, facebook, etc > ya sea una o más opciones
} satisfies NextAuthConfig