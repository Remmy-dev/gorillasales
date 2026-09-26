'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'gorillasales-enterprise-secret-key-change-in-prod-2026'
);

const COOKIE_NAME = 'gorillasales_session';

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'SALES_OFFICER' | 'DELIVERY_SUPPORT' | 'DRIVER';
  organizationId: string;
  organizationName: string;
  initials: string;
}

/**
 * Sign JWT session payload
 */
export async function encryptSession(payload: UserSession): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verify and decrypt JWT session token
 */
export async function decryptSession(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload as unknown as UserSession;
  } catch (error) {
    return null;
  }
}

/**
 * Get current authenticated user session from HTTP-only cookie
 */
export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await decryptSession(token);
}

/**
 * Login Server Action
 */
export async function loginAction(email: string): Promise<{ success: boolean; session?: UserSession; error?: string }> {
  try {
    // 1. Check database for existing user
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { organization: true },
    });

    // 2. If database is not populated or user not found, support seeded demo users
    if (!user) {
      const org = await prisma.organization.findFirst({ where: { slug: 'gorilla-coffee' } }) || {
        id: 'gorilla-coffee-default',
        name: 'Gorilla Coffee Distribution Ltd',
      };

      const demoUsers: Record<string, Partial<UserSession>> = {
        'eric.m@gorillacoffee.rw': { name: 'Mugabe Eric', role: 'MANAGER', initials: 'ME' },
        'remmy.k@gorillacoffee.rw': { name: 'Karenzi Remmy', role: 'SALES_OFFICER', initials: 'KR' },
        'alex.m@gorillacoffee.rw': { name: 'Alex Mushumba', role: 'SALES_OFFICER', initials: 'AM' },
        'patience.i@gorillacoffee.rw': { name: 'Isimbi Patience', role: 'SALES_OFFICER', initials: 'IP' },
        'frank.m@gorillacoffee.rw': { name: 'Mastiko Frank', role: 'SALES_OFFICER', initials: 'MF' },
        'dan.m@gorillacoffee.rw': { name: 'Muyenzi Dan', role: 'SALES_OFFICER', initials: 'MD' },
      };

      const matched = demoUsers[email.toLowerCase().trim()];
      if (matched) {
        const sessionPayload: UserSession = {
          userId: `usr-${Date.now()}`,
          email: email.toLowerCase().trim(),
          name: matched.name!,
          role: matched.role as any,
          organizationId: org.id,
          organizationName: org.name,
          initials: matched.initials!,
        };

        await setSessionCookie(sessionPayload);
        return { success: true, session: sessionPayload };
      }

      return { success: false, error: 'Invalid user email credentials.' };
    }

    const sessionPayload: UserSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
      organizationName: user.organization.name,
      initials: user.initials,
    };

    await setSessionCookie(sessionPayload);
    return { success: true, session: sessionPayload };
  } catch (error: any) {
    console.error('Error in loginAction:', error);
    return { success: false, error: error.message || 'Authentication failed' };
  }
}

/**
 * Set HTTP-only session cookie
 */
export async function setSessionCookie(session: UserSession) {
  const token = await encryptSession(session);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Logout Server Action
 */
export async function logoutAction(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return { success: true };
}
