import { CollectionConfig } from "payload";

export const Announcements: CollectionConfig = {
  slug: "announcements",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "kind",
      type: "select",
      required: true,
      options: [
        { label: "Info", value: "info" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Error", value: "error" },
      ],
    },
    {
      name: "event",
      type: "relationship",
      relationTo: "events",
    },
    {
      name: "event-series",
      type: "relationship",
      relationTo: "event-series",
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
  ],
};
