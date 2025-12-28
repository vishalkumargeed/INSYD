import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "User is not authenticated" },
                { status: 401 }
            );
        }

        const body = await req.json();
        
        if (!body?.name || !body.name.trim()) {
            return NextResponse.json(
                { message: "Store name is required" },
                { status: 400 }
            );
        }

        if (!body?.email || !body.email.trim()) {
            return NextResponse.json(
                { message: "Store owner email is required" },
                { status: 400 }
            );
        }

        const manufacturerEmail = session.user.email;
        const manufacturer = await prisma.user.findUnique({
            where: { email: manufacturerEmail }
        });

        if (!manufacturer || manufacturer.role !== "manufacturer") {
            return NextResponse.json(
                { message: "Only manufacturers can create stores" },
                { status: 403 }
            );
        }

        const existingStore = await prisma.store.findUnique({
            where: { email: body.email.trim() }
        });

        if (existingStore) {
            return NextResponse.json(
                { message: "Store with this email already exists" },
                { status: 400 }
            );
        }

        const store = await prisma.store.create({
            data: {
                name: body.name.trim(),
                email: body.email.trim(),
                manufacturerId: manufacturer.id
            }
        });

        const storeOwner = await prisma.user.findUnique({
            where: { email: body.email.trim() }
        });

        if (storeOwner) {
            await prisma.user.update({
                where: { email: body.email.trim() },
                data: { storeId: store.id }
            });
        } else {
            await prisma.user.create({
                data: {
                    email: body.email.trim(),
                    role: "store",
                    storeId: store.id
                }
            });
        }

        return NextResponse.json(
            { message: "Store created successfully", store },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating store:", error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : "Internal Server Error",
                message: "Error creating store"
            },
            { status: 500 }
        );
    }
}
