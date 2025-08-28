import { CollectionConfig } from "payload";

export const Events: CollectionConfig = {
  slug: "events",
  fields: [
    {
      name: "timestamp",
      type: "date",
      timezone: true,
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "location",
      type: "text",
      required: true,
    },
    {
      name: "coverImage",
      type: "relationship",
      relationTo: "media",
    },
    {
      name: "difficulty",
      type: "text",
      required: true,
    },
    {
      name: "distance",
      type: "number",
      required: true,
    },
    {
      name: "duration",
      type: "text",
      required: true,
    },
    {
      name: "mapEmbedUrl",
      type: "text",
    },
    {
      name: "mapMeetUrl",
      type: "text",
    },

    {
      name: "series",
      type: "relationship",
      relationTo: "event-series",
    },
  ],
};
