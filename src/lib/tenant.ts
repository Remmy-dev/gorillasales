import { prisma } from './prisma';

export interface TenantContext {
  organizationId: string;
  userId?: string;
  role?: string;
}

/**
 * Resolves the active tenant context for Server Actions.
 * In full production, this extracts the tenantId & user from session/JWT cookies.
 * For initial setup, it resolves the default seeded organization ('gorilla-coffee').
 */
export async function getTenantContext(): Promise<TenantContext> {
  try {
    const org = await prisma.organization.findFirst({
      where: { slug: 'gorilla-coffee' },
      select: { id: true },
    });

    if (org) {
      return { organizationId: org.id };
    }
  } catch (error) {
    console.warn('⚠️ Could not connect to database in getTenantContext. Falling back to default tenant ID.', error);
  }

  // Default fallback tenant ID
  return { organizationId: 'gorilla-coffee-default' };
}
