import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req:NextRequest) {
    try {
        const products = await prisma.product.findMany();
        console.log("products fetched successfully:", products);
        return NextResponse.json({ products }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    
}

