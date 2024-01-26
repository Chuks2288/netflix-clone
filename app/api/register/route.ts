// import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

import bcrypt from "bcryptjs"

export async function POST(
    req: Request,

) {

    if (req.method !== "POST") {
        return new NextResponse("Unauthorized", { status: 405 });
    }

    try {
        const { email, name, password } = await req.json();

        const existingUser = await db.user.findUnique({
            where: {
                email,
            }
        });

        if (existingUser) {
            return new NextResponse("Email taken", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await db.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: "",
                emailVerified: new Date(),
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.log("REGISTRATION_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}