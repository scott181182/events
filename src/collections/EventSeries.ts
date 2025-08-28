import { CollectionConfig } from "payload";

export const EventSeries: CollectionConfig = {
  slug: "event-series",
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "host",
      type: "text",
    },
    {
      name: "events",
      type: "relationship",
      relationTo: "events",
      hasMany: true,
    },
  ],
};
