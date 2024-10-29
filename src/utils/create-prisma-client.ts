import { PrismaD1 } from "@prisma/adapter-d1";
import { Bindings } from "../types/bindings";
import { PrismaClient } from "@prisma/client";

export function createPrismaClient(env: Bindings) {
  const adapter = new PrismaD1(env.DB);
  return new PrismaClient({ adapter, log: ['query'] });
}
