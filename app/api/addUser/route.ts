import { Prisma } from "@/lib/generated/prisma/browser";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import {  NextResponse } from "next/server";

export  async function GET () {
    const session = await getServerSession();

    if ( !session){
        return NextResponse.json ({
            
            "message" :"user is not authenticated ! " ,  
            "status" : 401
        })
    }

    try {
        
        // checking if the user is already present or not ! 
        const alreadyUser = await prisma.user.findUnique({
            where : {
                email : session?.user?.email as string
            }
        })
        if(!alreadyUser){
        // we need to push the data into the postgres yusing prisma orm 
        const user = await prisma.user.create({
            data: {
                name : session?.user?.name || "",
                email: session?.user?.email || ""
            }
        })
        console.log ("user created response : ", user)
            return NextResponse.json({
                "message" : 'user authenticated and created into the database ' ,
                "response "  :user,  
                "data"  : session.user?.name,

            })
        }else {
            console.log("user already exists ! ")
            return NextResponse.json({
                "message" : "user already exists " , 
            })
        }
    }
    catch(error ) {
       return  NextResponse.json({
            "error" : error,
            "message" : "from catch block"
        })
    }
}