import { CollectionConfig } from "payload";

export const Websites: CollectionConfig = {
  slug: "websites",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "url",
      type: "text",
      required: true,
    },
    {
      name: "logo",
      type: "relationship",
      relationTo: "media",
    },
    {
      name: "monochrome_icon_svg",
      type: "text",
    },
  ],
};
