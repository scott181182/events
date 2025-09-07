import { CollectionConfig } from "payload";
import { linksField } from "./fields/links";
import { commentsField, reactionField } from "./fields/comments";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    preview: ({ id }) => `/events/${id}`,
  },
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
      name: "name",
      type: "text",
      required: true,
      defaultValue: "Hike",
    },
    {
      name: "location",
      type: "relationship",
      relationTo: "locations",
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
      name: "meetCoordinates",
      type: "group",
      fields: [
        {
          name: "latitude",
          type: "number",
        },
        {
          name: "longitude",
          type: "number",
        },
      ],
    },
    {
      name: "details",
      type: "richText",
    },
    {
      name: "announcements",
      type: "join",
      collection: "announcements",
      on: "event",
    },
    linksField,
    commentsField,
    reactionField,
    {
      name: "series",
      type: "relationship",
      relationTo: "event-series",
    },
  ],
};
