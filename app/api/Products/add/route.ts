import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) { 
    try {
        const body = await req.json();
        
        if (!body?.name || !body.name.trim()) {
            return NextResponse.json(
                { message: "Product name is required" },
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "User is not authenticated" },
                { status: 401 }
            );
        }

        const email = session.user.email;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (user?.role === "manufacturer") {
            const product = await prisma.product.create({
                data: {
                    name: body.name.trim()
                }
            });

            return NextResponse.json({
                message: "Product added successfully",
                product: product
            }, { status: 201 });
        } else {
            return NextResponse.json({
                message: "Only manufacturers can add products"
            }, { status: 403 });
        }
   } catch (error) {
        console.error("Error in add product API:", error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : "Internal Server Error",
                message: "Error adding product"
            },
            { status: 500 }
        );
   }
}