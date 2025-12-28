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

        // if the user is a manufacturer then he can add the products
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "User is not authenticated" },
                { status: 401 }
            );
        }

        const email = session.user.email;
        // then we need to check if the user is a manufacturer or not! 
        const roleResponse = await prisma.user.findUnique({
            where: {
                email: email
            }
        }) 

        if(roleResponse?.role === "manufacturer") {
        
            // then we need to add the products 
            const addProductResponse = await prisma.product.create({
                data : {
                    name : body?.name
                }
            })

            console.log("addProductResponse is: " , addProductResponse );
            return NextResponse.json ({
                "messaGE ": "product added successfully ! ",
                "product": addProductResponse
            }, { status: 201 }) 
        } else { 
            return NextResponse.json ({
                "message" : "user is not manufacturer"
            }, { status: 403 })
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