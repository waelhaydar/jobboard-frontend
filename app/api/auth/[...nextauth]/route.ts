import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getEntityFromToken, signToken, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prismaClient';
import bcrypt from 'bcryptjs';
export const dynamic = 'force-dynamic'
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      type: string;
      token?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    role: string;
    type: string;
    token?: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        type: { label: 'Type', type: 'text' }, // 'admin', 'candidate', 'employer'
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        const { email, password, type } = credentials;

        if (type === 'admin') {
          const admin = await prisma.admin.findUnique({ where: { email } });
          if (admin && bcrypt.compareSync(password, admin.password)) {
            return { id: admin.id.toString(), email: admin.email, role: 'ADMIN', type: 'admin' };
          }
        } else if (type === 'candidate') {
          const candidate = await prisma.candidate.findUnique({ where: { email } });
          if (candidate && bcrypt.compareSync(password, candidate.password)) {
            return { id: candidate.id.toString(), email: candidate.email, role: 'CANDIDATE', type: 'candidate' };
          }
        } else if (type === 'employer') {
          const employer = await prisma.employer.findUnique({ where: { email } });
          if (employer && bcrypt.compareSync(password, employer.password)) {
            return { id: employer.id.toString(), email: employer.email, role: 'EMPLOYER', type: 'employer' };
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.type = user.type;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.type = token.type as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
});

export { handler as GET, handler as POST };
