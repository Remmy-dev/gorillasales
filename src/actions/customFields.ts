'use server';

import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export interface CustomFieldDefinitionDTO {
  id: string;
  entityType: string;
  name: string;
  fieldKey: string;
  fieldType: 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT' | 'BOOLEAN' | 'MULTI_SELECT';
  options?: string[];
  isRequired: boolean;
  sortOrder: number;
}

export interface CreateCustomFieldInput {
  entityType: 'CUSTOMER' | 'VISIT_LOG' | 'DEAL' | 'PRODUCT';
  name: string;
  fieldKey?: string;
  fieldType: 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT' | 'BOOLEAN' | 'MULTI_SELECT';
  options?: string[];
  isRequired?: boolean;
}

export interface CustomFieldValueDTO {
  id: string;
  entityType: string;
  entityId: string;
  fieldDefinitionId: string;
  fieldKey: string;
  fieldName: string;
  fieldType: string;
  value: any;
}

/**
 * Fetch dynamic custom field definitions for an entity type
 */
export async function getCustomFieldDefinitions(entityType: 'CUSTOMER' | 'VISIT_LOG' | 'DEAL' | 'PRODUCT'): Promise<CustomFieldDefinitionDTO[]> {
  try {
    const { organizationId } = await getTenantContext();

    const defs = await prisma.customFieldDefinition.findMany({
      where: { organizationId, entityType },
      orderBy: { sortOrder: 'asc' },
    });

    return defs.map((d: any) => ({
      id: d.id,
      entityType: d.entityType,
      name: d.name,
      fieldKey: d.fieldKey,
      fieldType: d.fieldType,
      options: Array.isArray(d.options) ? (d.options as string[]) : undefined,
      isRequired: d.isRequired,
      sortOrder: d.sortOrder,
    }));
  } catch (error) {
    console.warn('⚠️ getCustomFieldDefinitions error:', error);
    return [];
  }
}

/**
 * Create a new dynamic custom field definition (Twenty CRM style)
 */
export async function createCustomFieldDefinition(input: CreateCustomFieldInput): Promise<{ success: boolean; definition?: CustomFieldDefinitionDTO; error?: string }> {
  try {
    const { organizationId } = await getTenantContext();

    const fieldKey = input.fieldKey || input.name.toLowerCase().replace(/[^a-z0-9]/g, '_');

    // Convert string enum
    let fType: any = 'TEXT';
    if (input.fieldType === 'NUMBER') fType = 'NUMBER';
    else if (input.fieldType === 'DATE') fType = 'DATE';
    else if (input.fieldType === 'SELECT') fType = 'SELECT';
    else if (input.fieldType === 'BOOLEAN') fType = 'BOOLEAN';
    else if (input.fieldType === 'MULTI_SELECT') fType = 'MULTI_SELECT';

    const newDef = await prisma.customFieldDefinition.create({
      data: {
        organizationId,
        entityType: input.entityType,
        name: input.name,
        fieldKey,
        fieldType: fType,
        options: input.options ? input.options : undefined,
        isRequired: input.isRequired ?? false,
      },
    });

    return {
      success: true,
      definition: {
        id: newDef.id,
        entityType: newDef.entityType,
        name: newDef.name,
        fieldKey: newDef.fieldKey,
        fieldType: newDef.fieldType,
        options: Array.isArray(newDef.options) ? (newDef.options as string[]) : undefined,
        isRequired: newDef.isRequired,
        sortOrder: newDef.sortOrder,
      },
    };
  } catch (error: any) {
    console.error('Error creating custom field definition:', error);
    return { success: false, error: error.message || 'Failed to create custom field' };
  }
}

/**
 * Save custom field value for a specific record
 */
export async function saveCustomFieldValue(entityType: string, entityId: string, fieldDefinitionId: string, value: any): Promise<{ success: boolean; error?: string }> {
  try {
    const { organizationId } = await getTenantContext();

    await prisma.customFieldValue.upsert({
      where: {
        entityType_entityId_fieldDefinitionId: {
          entityType,
          entityId,
          fieldDefinitionId,
        },
      },
      update: {
        value: JSON.stringify(value),
      },
      create: {
        organizationId,
        entityType,
        entityId,
        fieldDefinitionId,
        value: JSON.stringify(value),
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error saving custom field value:', error);
    return { success: false, error: error.message || 'Failed to save value' };
  }
}

/**
 * Get all custom field values for a specific record
 */
export async function getCustomFieldValues(entityType: string, entityId: string): Promise<CustomFieldValueDTO[]> {
  try {
    const { organizationId } = await getTenantContext();

    const values = await prisma.customFieldValue.findMany({
      where: { organizationId, entityType, entityId },
      include: {
        fieldDefinition: true,
      },
    });

    return values.map((v: any) => ({
      id: v.id,
      entityType: v.entityType,
      entityId: v.entityId,
      fieldDefinitionId: v.fieldDefinitionId,
      fieldKey: v.fieldDefinition.fieldKey,
      fieldName: v.fieldDefinition.name,
      fieldType: v.fieldDefinition.fieldType,
      value: typeof v.value === 'string' ? JSON.parse(v.value) : v.value,
    }));
  } catch (error) {
    console.warn('⚠️ getCustomFieldValues error:', error);
    return [];
  }
}
