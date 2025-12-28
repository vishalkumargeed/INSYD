import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const products = await prisma.product.findMany();
        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : "Internal Server Error",
                message: "Error fetching products"
            },
            { status: 500 }
        );
    }
}

