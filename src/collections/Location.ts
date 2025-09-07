import { CollectionConfig } from "payload";

export const Locations: CollectionConfig = {
  slug: "locations",
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
      name: "address",
      type: "text",
    },
    {
      name: "city",
      type: "text",
      defaultValue: "Cincinnati",
    },
    {
      name: "state",
      type: "text",
      defaultValue: "Ohio",
    },
    {
      name: "country",
      type: "text",
      defaultValue: "USA",
    },
    {
      name: "postalCode",
      type: "text",
    },
  ],
};
