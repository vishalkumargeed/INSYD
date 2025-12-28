"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function SigninButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
        <p className="text-foreground font-base text-sm sm:text-base text-center sm:text-left">
          {session.user.name}
        </p>
        <Button 
          variant="outline" 
          onClick={() => signOut()} 
          className="w-full sm:w-auto"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={() => signIn("google", { callbackUrl: "/form" })} 
      className="w-full sm:w-auto"
    >
      Sign In with Google
    </Button>
  );
}

