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
        
        if (!body?.productId || !body.productId.trim()) {
            return NextResponse.json(
                { message: "Product ID is required" },
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
                { message: "Only store owners can add products to inventory" },
                { status: 403 }
            );
        }

        const product = await prisma.product.findUnique({
            where: { id: body.productId }
        });

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        const existingInventory = await prisma.storeInventory.findUnique({
            where: {
                storeId_productId: {
                    storeId: user.storeId,
                    productId: body.productId
                }
            }
        });

        if (existingInventory) {
            const updated = await prisma.storeInventory.update({
                where: { id: existingInventory.id },
                data: {
                    initialQuantity: existingInventory.initialQuantity + body.quantity,
                    currentQuantity: existingInventory.currentQuantity + body.quantity
                }
            });
            return NextResponse.json(
                { message: "Inventory updated successfully", inventory: updated },
                { status: 200 }
            );
        }

        const inventory = await prisma.storeInventory.create({
            data: {
                storeId: user.storeId,
                productId: body.productId,
                initialQuantity: body.quantity,
                currentQuantity: body.quantity
            }
        });

        return NextResponse.json(
            { message: "Product added to inventory successfully", inventory },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding to inventory:", error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : "Internal Server Error",
                message: "Error adding to inventory"
            },
            { status: 500 }
        );
    }
}
