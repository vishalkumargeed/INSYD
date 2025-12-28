import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";

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
        
        if (!body?.inventoryId || !body.inventoryId.trim()) {
            return NextResponse.json(
                { message: "Inventory ID is required" },
                { status: 400 }
            );
        }

        if (!body?.quantity || body.quantity <= 0) {
            return NextResponse.json(
                { message: "Valid quantity is required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user || user.role !== "store" || !user.storeId) {
            return NextResponse.json(
                { message: "Only store owners can decrease inventory" },
                { status: 403 }
            );
        }

        const inventory = await prisma.storeInventory.findUnique({
            where: { id: body.inventoryId }
        });

        if (!inventory || inventory.storeId !== user.storeId) {
            return NextResponse.json(
                { message: "Inventory not found or access denied" },
                { status: 404 }
            );
        }

        if (inventory.currentQuantity < body.quantity) {
            return NextResponse.json(
                { message: "Insufficient quantity in inventory" },
                { status: 400 }
            );
        }

        const updated = await prisma.storeInventory.update({
            where: { id: body.inventoryId },
            data: {
                currentQuantity: inventory.currentQuantity - body.quantity
            }
        });

        return NextResponse.json(
            { message: "Quantity decreased successfully", inventory: updated },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error decreasing inventory:", error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : "Internal Server Error",
                message: "Error decreasing inventory"
            },
            { status: 500 }
        );
    }
}
