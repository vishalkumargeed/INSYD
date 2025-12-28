'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RoleSelectionForm from "../components/Form";
import { Loader } from "@/components/ui/loader";

export default function FormRoute() { 
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isChecking, setIsChecking] = useState(true);
    const [hasRole, setHasRole] = useState(false);

    useEffect(() => {
        async function checkUserRole() {
            if (status === "loading") return;
            
            if (!session?.user?.email) {
                setIsChecking(false);
                return;
            }

            try {
                const response = await fetch("/api/user/current");
                if (response.ok) {
                    const data = await response.json();
                    if (data.user && data.user.role) {
                        // User already has a role, redirect to dashboard
                        setHasRole(true);
                        router.push("/dashboard");
                        return;
                    }
                }
            } catch (error) {
                console.error("Error checking user role:", error);
            } finally {
                setIsChecking(false);
            }
        }

        checkUserRole();
    }, [session, status, router]);

    async function handleSubmit(role: "manufacturer" | "store") {
        try {
            const response = await fetch("/api/addUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });

            const data = await response.json();
            
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

    if (status === "loading" || isChecking || hasRole) {
    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader size="lg" />
                    <p className="text-muted-foreground font-base">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        router.push("/");
        return null;
    }

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 flex items-center justify-center">
            <RoleSelectionForm onSubmit={handleSubmit}/>
        </div>
    );
}