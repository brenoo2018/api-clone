import { Event } from "@prisma/client";
import { Bindings } from "../../types/bindings";

export type TPropsSearchEventsByUncheckedChristian = {
  env: Bindings;
  is_checked_christian: boolean;
  page: number;
  limit: number;
};
export type TPropsSearchEventsByUncheckedNSFW = {
  env: Bindings;
  is_checked_nsfw: boolean;
  page: number;
  limit: number;
};
export type TPropsSearchEventsByUncheckedTAGS = {
  env: Bindings;
  is_checked_tags: boolean;
  page: number;
  limit: number;
};
export type TPropsUpdateByChristian = {
  env: Bindings;
  event_id: number;
  is_checked_christian?: boolean;
  deleted_at?: number | null;
  reason?: string | null;
  // is_active?: boolean;
  is_pending?: boolean;
};
export type TPropsUpdateByNSFW = {
  env: Bindings;
  event_id: number;
  is_checked_nsfw?: boolean;
  deleted_at?: number | null;
  reason?: string | null;
  // is_active?: boolean;
  is_pending?: boolean;
};
export type TPropsUpdateByTAGS = {
  env: Bindings;
  event_id: number;
  is_checked_tags?: boolean;
  deleted_at?: number | null;
  reason?: string | null;
  is_active?: boolean;
  is_pending?: boolean;
};

export interface EventsAiRepository {
  searchByUncheckedChristian(params: TPropsSearchEventsByUncheckedChristian): Promise<{
    id: number;
    org_name: string | null;
    title: string;
    description: string | null;
  }[]>;
  searchByUncheckedNSFW(params: TPropsSearchEventsByUncheckedNSFW): Promise<{
    id: number;
    url_image: string;
  }[]>;
  searchByUncheckedTags(params: TPropsSearchEventsByUncheckedTAGS): Promise<{
    id: number;
    title: string;
    description: string | null;
  }[]>;
  updateCheckedChristian(params: TPropsUpdateByChristian): Promise<void>
  updateCheckedNSFW(params: TPropsUpdateByNSFW): Promise<void>
  updateCheckedTags(params: TPropsUpdateByTAGS): Promise<void>
}