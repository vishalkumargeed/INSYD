'use client'
import { useRouter } from "next/navigation";
import RoleSelectionForm from "../components/Form";

export default function FormRoute () { 
    const router = useRouter()
  

 async function handleSubmit(role: "manufacturer" | "store") {
    try {
      const response = await fetch("/api/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();
      console.log("response after entering data:", data);
      
      if (response.ok) {
        router.push("/dashboard");
      } else {
        console.error("Error creating user:", data.message || data.error);
        alert(data.message || "Failed to create user. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please try again.");
    }
  }

return (<>
        <div className="">
                    <RoleSelectionForm onSubmit={handleSubmit}/>

        </div>
    </>)
}