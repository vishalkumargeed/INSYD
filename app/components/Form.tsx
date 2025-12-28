"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

export default function RoleSelectionForm({
  onSubmit,
}: {
  onSubmit: (role: "manufacturer" | "store") => void;
}) {
  const { data: session } = useSession();
  const [role, setRole] = useState<"manufacturer" | "store" | "">("manufacturer");

  return (
   <Card className="w-full max-w-md mx-auto">
  <CardHeader>
    <CardTitle className="text-xl sm:text-2xl">Select your role</CardTitle>
    <CardDescription className="text-sm">
      This choice cannot be changed later.
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-6">
    {/* User Info */}
    <div className="rounded-base border-2 border-border p-3 sm:p-4 text-sm space-y-2 shadow-shadow bg-secondary-background">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
        <span className="text-muted-foreground font-base">Name</span>
        <span className="font-heading break-word">{session?.user?.name}</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
        <span className="text-muted-foreground font-base">Email</span>
        <span className="font-heading break-all text-xs sm:text-sm">{session?.user?.email}</span>
      </div>
    </div>

    {/* Role Selection */}
    <RadioGroup
      value={role}
      onValueChange={(value) =>
        setRole(value as "manufacturer" | "store")
      }
      className="space-y-4"
    >
      <div className="flex items-center space-x-3 rounded-base border-2 border-border p-3 sm:p-4 shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all cursor-pointer">
        <RadioGroupItem value="manufacturer" id="manufacturer" />
        <Label htmlFor="manufacturer" className="cursor-pointer font-base text-sm sm:text-base">
          Manufacturer
        </Label>
      </div>

      <div className="flex items-center space-x-3 rounded-base border-2 border-border p-3 sm:p-4 shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all cursor-pointer">
        <RadioGroupItem value="store" id="store" />
        <Label htmlFor="store" className="cursor-pointer font-base text-sm sm:text-base">
          Store
        </Label>
      </div>
    </RadioGroup>
  </CardContent>

  <CardFooter>
    <Button
      className="w-full"
      disabled={!role}
      onClick={() => {
        if (role === "manufacturer" || role === "store") {
          onSubmit(role);
        }
      }}
    >
      Continue
    </Button>
  </CardFooter>
</Card>

  );
}
