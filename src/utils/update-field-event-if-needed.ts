import { Prisma } from "@prisma/client";
import { SearchEventByExternalId } from "../domain/entities/events";
import { EventDtoUpdate } from "../infra/dto/event-dto";

export function updateEventIfNeeded(eventData: SearchEventByExternalId, updatedData: Partial<EventDtoUpdate>) {
  const fieldsToUpdate: Record<string, any> = {};



  // Comparar e adicionar os campos que mudaram
  if (eventData.title?.trim() !== updatedData.title?.trim()) {
    fieldsToUpdate.title = updatedData.title;
  }
  if (eventData.description?.trim() !== updatedData.description?.trim()) {
    fieldsToUpdate.description = updatedData.description;
  }
  if (eventData.start_at !== updatedData.start_at) {
    fieldsToUpdate.start_at = updatedData.start_at;
  }
  if (eventData.end_at !== updatedData.end_at) {
    fieldsToUpdate.end_at = updatedData.end_at;
  }
  if (eventData.local?.trim() !== updatedData.local?.trim()) {
    fieldsToUpdate.local = updatedData.local;
  }
  if (eventData.latitude?.toString() !== updatedData.latitude?.toString()) {
    fieldsToUpdate.latitude = new Prisma.Decimal(updatedData.latitude!);
  }
  if (eventData.longitude?.toString() !== updatedData.longitude?.toString()) {
    fieldsToUpdate.longitude = new Prisma.Decimal(updatedData.longitude!);
  }
  if (eventData.url_event.trim() !== updatedData.url_event?.trim()) {
    fieldsToUpdate.url_event = updatedData.url_event;
  }
  if (eventData.url_image?.trim() !== updatedData.url_image?.trim()) {
    fieldsToUpdate.url_image = updatedData.url_image;
  }
  if (eventData.is_free !== updatedData.is_free) {
    fieldsToUpdate.is_free = updatedData.is_free;
  }
  if (eventData.amount_inscription !== updatedData.amount_inscription) {
    fieldsToUpdate.amount_inscription = updatedData.amount_inscription;
  }
  if (eventData.amount_view !== updatedData.amount_view) {
    fieldsToUpdate.amount_view = updatedData.amount_view;
  }
  if (eventData.org_name?.trim() !== updatedData.org_name?.trim()) {
    fieldsToUpdate.org_name = updatedData.org_name;
  }
  if (eventData.reason?.trim() !== updatedData.reason?.trim()) {
    fieldsToUpdate.reason = updatedData.reason;
  }
  if (eventData.deleted_at !== updatedData.deleted_at) {
    fieldsToUpdate.deleted_at = updatedData.deleted_at;
  }

  // Remover campos undefined e null
  const cleanedFields = Object.fromEntries(
    Object.entries(fieldsToUpdate).filter(([_, value]) => value !== undefined)
  );


  if (Object.keys(cleanedFields).length > 0) {
    cleanedFields.updated_at = Math.floor(new Date().getTime() / 1000);
  }

  return cleanedFields;
}