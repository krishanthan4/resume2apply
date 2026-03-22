import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET || "default_secret_key_change_this_in_production";
const key = new TextEncoder().encode(secretKey);

export const COOKIE_NAME = "resume_auth_token";

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get(COOKIE_NAME)?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get(COOKIE_NAME)?.value;
    if (!session) return null;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    if (!parsed) return null;

    parsed.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: COOKIE_NAME,
        value: await encrypt(parsed),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: parsed.expires,
        sameSite: "lax",
        path: "/",
    });
    return res;
}
