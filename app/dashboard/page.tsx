'use client'
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";


export default   function  Dashboard () {
      const { data: session } = useSession();



    return(<>
    <div className="flex h-screen justify-center items-center ">
    <h1>Welcome , {session?.user?.name} </h1>
    <br />
    <Button variant="destructive" onClick={()=>signOut({callbackUrl: "/"})}>Signout </Button>
    </div>
        
        </>)
}