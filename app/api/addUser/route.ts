
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import {  NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        
        if (!session || !session.user?.email) {
            return NextResponse.json(
                {
                    message: "User is not authenticated",
                },
                { status: 401 }
            );
        }

        if (!body?.role || (body.role !== "manufacturer" && body.role !== "store")) {
            return NextResponse.json(
                {
                    message: "Invalid role. Role must be 'manufacturer' or 'store'",
                },
                { status: 400 }
            );
        }

        // Check if the user already exists
        const alreadyUser = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });

        if (!alreadyUser) {
            const user = await prisma.user.create({
                data: {
                    name: session.user.name || null,
                    email: session.user.email,
                    role: body.role as "manufacturer" | "store"
                }
            });
            
            return NextResponse.json(
                {
                    message: "User authenticated and created successfully",
                    user: user,
                },
                { status: 201 }
            );
        } else {
            // Update user name if it's missing but available in session
            if (!alreadyUser.name && session.user.name) {
                const updatedUser = await prisma.user.update({
                    where: { email: session.user.email },
                    data: { name: session.user.name }
                });
                return NextResponse.json(
                    {
                        message: "User already exists, name updated",
                        user: updatedUser,
                    },
                    { status: 200 }
                );
            }
            return NextResponse.json(
                {
                    message: "User already exists",
                    user: alreadyUser,
                },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Error in addUser API:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Unknown error",
                message: "Error creating user"
            },
            { status: 500 }
        );
    }
}