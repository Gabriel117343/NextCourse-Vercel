import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'

import type { User } from '@app/lib/definitions'
import bcryptjs from 'bcryptjs'
import postgres from 'postgres'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

async function getUser(email: string): Promise<User | null> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email = ${email}`
    return user[0]
  } catch (error) {
    console.log('Failed to fetch user:', error)
    throw new Error('Failed to fetch user')
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // provideres representa un array donde se listas las diferentes opciones de login como Google, GitHub etc..
  // permite al usuario loggearse con su correo/nombre y contraseña 
  providers: [Credentials({
    async authorize(credentials) {
      // antes validamos y parseamos las credenciales con la librería zod
      const parsedCredentials = z
        .object({ email: z.string(), password: z.string().min(6) })
        .safeParse(credentials)
      if (parsedCredentials.success) { // si todo sale bien, se procede a buscar el usuario en la base de datos
        const { email, password  } = parsedCredentials.data
        const user = await getUser(email)
        if (!user) return null

        // verificar que las contraseñas coincidan
        const passwordMatch = await bcryptjs.compare(password, user.password) // compara la contraseña ingresada con la contraseña almacenada en la base de datos
        if (passwordMatch) return user 
      }
      console.log('Invalid credentials')
      return null // Nota: cada null representa un fallo en la autenticación para prevenir que el usuario se logee con credenciales inválidas
    }
  })] // https://authjs.dev/getting-started/providers/credentials?framework=next-js
})