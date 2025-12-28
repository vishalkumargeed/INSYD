'use client'
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function  Dashboard () {
    return(<>
    <div className="flex h-screen justify-center items-center ">
    <h1>Dashboard </h1>
    <br />
    
    <Button variant="destructive" onClick={()=>signOut({callbackUrl: "/"})}>Signout </Button>
    </div>
        
        </>)
}