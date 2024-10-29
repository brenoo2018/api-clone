import { Bindings } from '../../types/bindings';

export type CategoryWithEventCount = {
  id: number;
  title: string;
  event_count: number;
};

export interface CategoriesRepository {
  countByCategory(env: Bindings, provider?: string, is_active?: boolean): Promise<CategoryWithEventCount[]>;
}
