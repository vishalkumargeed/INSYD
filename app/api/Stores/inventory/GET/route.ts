import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "User is not authenticated" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user || user.role !== "store" || !user.storeId) {
            return NextResponse.json(
                { message: "Only store owners can view inventory" },
                { status: 403 }
            );
        }

        const inventory = await prisma.storeInventory.findMany({
            where: { storeId: user.storeId },
            include: {
                product: true
            }
        });

        return NextResponse.json({ inventory }, { status: 200 });
    } catch (error) {
        console.error("Error fetching inventory:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
