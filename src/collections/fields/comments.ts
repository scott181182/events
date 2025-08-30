import { Field } from "payload";
import { z } from "zod";

import { toPayloadJsonSchema } from "../utils/json";

const reactionSchema = z.record(z.string(), z.number().int().nonnegative());

export const reactionField: Field = {
  name: "reactions",
  type: "json",
  jsonSchema: {
    uri: "file:/reaction-schema.json",
    fileMatch: ["file:/reaction-schema.json"],
    schema: toPayloadJsonSchema(reactionSchema),
  },
};

export const commentsField: Field = {
  name: "comments",
  type: "array",
  fields: [
    {
      name: "text",
      type: "richText",
      required: true,
    },
    {
      name: "author",
      type: "text",
      required: true,
    },
    reactionField,
  ],
};
