import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

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
            where: { email: session.user.email },
            include: { store: true }
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        if (user.role === "manufacturer") {
            const stores = await prisma.store.findMany({
                where: { manufacturerId: user.id },
                include: {
                    inventory: {
                        include: {
                            product: true
                        }
                    }
                }
            });
            return NextResponse.json({ stores }, { status: 200 });
        }

        if (user.role === "store" && user.storeId) {
            const store = await prisma.store.findUnique({
                where: { id: user.storeId }
            });
            return NextResponse.json({ store }, { status: 200 });
        }

        return NextResponse.json(
            { message: "No store found for this user" },
            { status: 404 }
        );
    } catch (error) {
        console.error("Error fetching store:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
