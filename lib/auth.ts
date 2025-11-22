import { hash, compare } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-secret-key-change-me'
);

export async function hashPassword(password: string) {
    return await hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
    return await compare(password, hash);
}

export async function signToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(SECRET_KEY);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    return await verifyToken(token);
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
}
