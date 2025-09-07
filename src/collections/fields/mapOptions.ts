import { Field } from "payload";
import { toPayloadJsonSchema } from "../utils/json";
import z from "zod";

const mapOptionsSchema = z
  .object({
    zoom: z.number().nonnegative(),
    center: z.tuple([z.number(), z.number()]),
  })
  .partial();

export const mapOptionsField: Field = {
  name: "mapOptions",
  type: "json",
  jsonSchema: {
    uri: "file:/map-option-schema.json",
    fileMatch: ["file:/map-option-schema.json"],
    schema: toPayloadJsonSchema(mapOptionsSchema),
  },
};
