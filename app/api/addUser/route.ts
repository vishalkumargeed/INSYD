
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
                    message: "user is not authenticated!",
                    status: 401
                },
                { status: 401 }
            );
        }

        if (!body?.role || (body.role !== "manufacturer" && body.role !== "store")) {
            return NextResponse.json(
                {
                    message: "Invalid role. Role must be 'manufacturer' or 'store'",
                    status: 400
                },
                { status: 400 }
            );
        }

        console.log("inside the api route!");
        console.log("Session user:", session.user);
        console.log("Body role:", body.role);

        // checking if the user is already present or not!
        const alreadyUser = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });

        if (!alreadyUser) {
            // we need to push the data into the postgres using prisma orm
            const user = await prisma.user.create({
                data: {
                    name: session.user.name || null,
                    email: session.user.email,
                    role: body.role as "manufacturer" | "store"
                }
            });
            
            console.log("user created response:", user);
            return NextResponse.json(
                {
                    message: "user authenticated and created into the database",
                    user: user,
                    data: session.user.name,
                    status: 201
                },
                { status: 201 }
            );
        } else {
            console.log("user already exists!");
            // Update user name if it's missing but available in session
            if (!alreadyUser.name && session.user.name) {
                const updatedUser = await prisma.user.update({
                    where: { email: session.user.email },
                    data: { name: session.user.name }
                });
                return NextResponse.json(
                    {
                        message: "user already exists, name updated",
                        user: updatedUser,
                        status: 200
                    },
                    { status: 200 }
                );
            }
            return NextResponse.json(
                {
                    message: "user already exists",
                    user: alreadyUser,
                    status: 200
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