import { z } from 'zod';

// export interface Event {
//   external_id?: number; //id do evento no provedor
//   org_name?: string; //nome da organização (empresa)
//   title: string; //título do evento
//   description?: string; //descrição do evento
//   state: string; //estado
//   city: string; //cidade
//   local?: string; //localização (ex: em frente ao estádio)
//   latitude?: number; //latitude
//   longitude?: number; //longitude
//   start_at: number; //data de início do evento padrão unix epoch. ex: Math.floor(new Date().getTime() / 1000)
//   end_at: number; //data do fim do evento padrão unix epoch. ex: Math.floor(new Date().getTime() / 1000)
//   url_event: string; //link pro evento
//   url_image: string; //link da imagem do evento
//   provider: string; //provedor. ex: einscricao, sympla, tiketo, eventbrite
//   free: boolean; //evento gratuito ou pago. TRUE ou FALSE
//   amount_inscription?: number; //qtd de inscritos no evento
//   event_modality: string[]; //modalidade ('1') PRESENCIAL ou ONLINE ('2')
// }

export const createEventBodySchema = z.array(z.object({
  is_active: z.boolean().optional(),
  external_id: z.number().optional(),
  org_name: z.string().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  state: z.string().nullable(),
  city: z.string().nullable(),
  local: z.string().optional().nullable(),
  latitude: z
    .number()
    .refine((value) => Math.abs(value) <= 90, { message: "Latitude deve estar entre -90 e 90." })
    .nullable()
    .optional(),
  longitude: z
    .number()
    .refine((value) => Math.abs(value) <= 180, { message: "Longitude deve estar entre -180 e 180." })
    .nullable()
    .optional(),
  start_at: z.number(),
  end_at: z.number(),
  url_event: z.string(),
  url_image: z.string().optional().nullable(),
  provider: z.string(),
  is_free: z.boolean(),
  amount_inscription: z.number().optional().default(0),
  event_category: z
    .preprocess((val) => (val === undefined ? undefined : val),
      z.array(z.number().min(1).max(11)) // Limita os valores a números de 1 a 11
    ).optional(),

  event_theme: z
    .preprocess((val) => (val === undefined ? undefined : val),
      z.array(z.number().min(1).max(24)) // Limita os valores a números de 1 a 24
    ).optional(),

  event_modality: z
    .array(z.number().min(1).max(2)), // Limita os valores a 1 ou 2
  is_checked_christian: z.boolean().optional(),
  is_checked_nsfw: z.boolean().optional(),
  is_checked_tags: z.boolean().optional(),
  amount_view: z.number().optional().default(0),
  reason: z.string().optional(),
  deleted_at: z.number().optional(),
}));

type Events = z.infer<typeof createEventBodySchema>;
export type EventDto = Events;
export type EventDtoUpdate = Events[number];
