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
import Image from "next/image";

export default function RoleSelectionForm({
  onSubmit,
}: {
  onSubmit: (role: "manufacturer" | "store") => void;
}) {

    const { data : session } = useSession()
  const [role, setRole] = useState<"manufacturer" | "store" | "">("manufacturer");

  return (
   <Card className="max-w-md mx-auto">
  <CardHeader>
    <CardTitle>Select your role</CardTitle>
    <CardDescription>
      This choice cannot be changed later.
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-6">
    {/* User Info */}
    <div className="rounded-md border p-4 text-sm space-y-1">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Name</span>
        <span className="font-medium">{session?.user?.name}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Email</span>
        <span className="font-medium">{session?.user?.email}</span>
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
      <div className="flex items-center space-x-3 rounded-md border p-3">
        <RadioGroupItem value="manufacturer" id="manufacturer" />
        <Label htmlFor="manufacturer" className="cursor-pointer">
          Manufacturer
        </Label>
      </div>

      <div className="flex items-center space-x-3 rounded-md border p-3">
        <RadioGroupItem value="store" id="store" />
        <Label htmlFor="store" className="cursor-pointer">
          Store
        </Label>
      </div>
    </RadioGroup>
  </CardContent>

  <CardFooter>
    <Button
      className="w-full"
      disabled={!role}
      onClick={() => onSubmit(role)}
    >
      Continue
    </Button>
  </CardFooter>
</Card>

  );
}
