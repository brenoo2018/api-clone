import { Prisma } from "@prisma/client";

export type SearchEventsPrisma = {
  id: number
  state: string
  city: string
  start_at: number
  end_at: number
  amount_inscription: number
  amount_view: number
  is_free: number
  latitude: number
  longitude: number
  local: string
  org_name: string
  title: string
  url_event: string
  url_image: string
  provider: string
  modality_ids: string
};
export type SearchEventsRepository = {
  id: number;
  state: string;
  city: string;
  start_at: string;
  end_at: string;
  amount_inscription: number;
  amount_view: number;
  is_free: number;
  latitude: number;
  longitude: number;
  local: string;
  org_name: string;
  title: string;
  url_event: string;
  url_image: string;
  provider: string;
  modality_ids: number[];
};

export type SearchEventByExternalId = {
  id: number;
  is_active?: boolean;
  title?: string;
  description?: string;
  state: string,
  city: string,
  local?: string;
  latitude?: Prisma.Decimal;
  longitude?: Prisma.Decimal;
  start_at: number;
  end_at: number;
  url_event: string,
  url_image?: string;
  is_free: boolean,
  amount_inscription?: number;
  amount_view?: number;
  updated_at: number;
  org_name?: string;
  reason?: string | null;
  deleted_at?: number | null;
  provider: string,
};