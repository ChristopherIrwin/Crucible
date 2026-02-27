import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
  },
})
