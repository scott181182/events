import z from "zod";
import type { JSONSchema4 } from "json-schema";

export function toPayloadJsonSchema(schema: z.core.$ZodType) {
  return z.toJSONSchema(schema, { target: "draft-4" }) as JSONSchema4;
}
