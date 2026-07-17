/**
 * Puerto que resuelve si una categoría cae bajo alguna de las categorías elegibles
 */
export interface CategoryHierarchy {
  isWithin(categoryId: string, eligibleCategoryIds: string[]): boolean;
}

export const CATEGORY_HIERARCHY = Symbol('CATEGORY_HIERARCHY');