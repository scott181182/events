import { Field } from "payload";

export const linksField: Field = {
  name: "links",
  type: "array",
  fields: [
    {
      name: "href",
      type: "text",
      required: true,
    },
    {
      name: "text",
      type: "text",
    },
    {
      name: "website",
      type: "relationship",
      relationTo: "websites",
    },
  ],
};
