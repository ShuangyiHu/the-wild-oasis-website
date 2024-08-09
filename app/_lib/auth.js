import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      //turn to a boolean
      return !!auth?.user;
    },
    //like the middleware between filling in credentials and being logged in
    //session is not created yet
    async signIn({ user, account, profile }) {
      //create a new user or retrieve an old user
      try {
        const existingGuest = await getGuest(user.email);
        // console.log("existingGuest", existingGuest);
        if (!existingGuest)
          await createGuest({ email: user.email, fullName: user.name });
        return true;
      } catch {
        return false;
      }
    },

    //runs after login and logout
    //so the guestId can be used everywhere
    async session({ session, user }) {
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;
      // console.log("session after mutation:", session);
      // console.log("user after mutation:", user);
      return session;
    },
  },
  pages: {
    signIn: "/login",
    // signOut: "/logout",
  },
};

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth(authConfig);
