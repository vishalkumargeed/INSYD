'use client'
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";


export default   function  Dashboard () {
      const { data: session } = useSession();
  useEffect(() => {
      async function main (){
        try {
        const res = await fetch("/api/addUser"); 
        if (!res.ok) {
           throw new Error("Failed to fetch data");
        }
        
        const jsonData = await res.json(); 
        console.log("jsonData" , jsonData)
        
      } catch (error) {
        console.error("Error while or performing the backend operation ! ", error);
      } 
      }
      main ();
  }, [])


    return(<>
    <div className="flex h-screen justify-center items-center ">
    <h1>Welcome , {session?.user?.name} </h1>
    <br />
    
    <Button variant="destructive" onClick={()=>signOut({callbackUrl: "/"})}>Signout </Button>
    </div>
        
        </>)
}