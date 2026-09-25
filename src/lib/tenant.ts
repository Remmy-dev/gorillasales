import { prisma } from './prisma';
import { getSession } from './auth';

export interface TenantContext {
  organizationId: string;
  userId?: string;
  role?: string;
}

/**
 * Resolves the active tenant context for Server Actions.
 * First checks JWT session cookie; falls back to default tenant if unauthenticated.
 */
export async function getTenantContext(): Promise<TenantContext> {
  try {
    const session = await getSession();
    if (session) {
      return {
        organizationId: session.organizationId,
        userId: session.userId,
        role: session.role,
      };
    }

    const org = await prisma.organization.findFirst({
      where: { slug: 'gorilla-coffee' },
      select: { id: true },
    });

    if (org) {
      return { organizationId: org.id };
    }
  } catch (error) {
    console.warn('⚠️ getTenantContext fallback:', error);
  }

  return { organizationId: 'gorilla-coffee-default' };
}
