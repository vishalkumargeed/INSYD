import Image from "next/image";
import { Button } from "@/components/ui/button"
import SigninButton from "./components/Signin";

export default function Home() {
  return (
   <div className="flex justify-center items-center h-screen">
   
     <SigninButton/>
     
   </div>
  );
}
