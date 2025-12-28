import Image from "next/image";
import { Button } from "@/components/ui/button"
import SigninButton from "./components/Signin";

export default function Home() {
  return (
   <div className="flex justify-center items-center min-h-screen bg-background p-4">
     <div className="w-full max-w-md">
       <SigninButton/>
     </div>
   </div>
  );
}
