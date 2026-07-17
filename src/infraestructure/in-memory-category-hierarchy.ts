import { Injectable } from '@nestjs/common';
import { CategoryHierarchy } from 'src/domain/ports/category-hierarchy.port';


@Injectable()
export class InMemoryCategoryHierarchy implements CategoryHierarchy {
  private readonly parentToChildren = new Map<string, string[]>();

  seed(parentId: string, childIds: string[]): void {
    this.parentToChildren.set(parentId, childIds);
  }

  isWithin(categoryId: string, eligibleCategoryIds: string[]): boolean {
    if (eligibleCategoryIds.includes(categoryId)) return true;

    return eligibleCategoryIds.some((eligibleId) =>
      this.isDescendantOf(categoryId, eligibleId),
    );
  }

  private isDescendantOf(categoryId: string, ancestorId: string): boolean {
    const children = this.parentToChildren.get(ancestorId) ?? [];
    if (children.includes(categoryId)) return true;
    return children.some((childId) => this.isDescendantOf(categoryId, childId));
  }
}