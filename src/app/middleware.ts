import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { auth } from './config/firebase';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: async ({ token }) => {
        try {
          const user = auth.currentUser;
          if (user) {
            return true;
          }
          return false;
        } catch (error) {
          console.error('Auth middleware error:', error);
          return false;
        }
      },
    },
  }
);

export const config = {
  matcher: ['/profile/:path*'],
};
