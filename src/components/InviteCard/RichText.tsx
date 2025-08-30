import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import { SerializedRelationshipNode } from "@payloadcms/richtext-lexical";
import type { SerializedEditorState, SerializedLexicalNode } from "lexical";

import cls from "./RichText.module.css";

function convertRelationshipNode(node: SerializedRelationshipNode): string {
  if (typeof node.value !== "object") {
    console.warn("Unrecognized relationship node in rich text:", node);
    return `<span class="badge badge-warning">${node.relationTo}:unknown</span>`;
  }
  if (node.relationTo === "events") {
    const url = `/events/${node.value.id}`;
    return `<a class="btn btn-sm" href="${url}" target="_blank">Event: ${node.value.location}</a>`;
  } else {
    return `<span class="badge badge-warning">${node.relationTo}:${node.value.id}</span>`;
  }
}

export interface RichTextProps {
  data: SerializedEditorState<SerializedLexicalNode>;
}
export function RichText({ data }: Readonly<RichTextProps>) {
  const html = convertLexicalToHTML({
    data,
    converters: ({ defaultConverters }) => ({
      ...defaultConverters,
      relationship: ({ node }) => convertRelationshipNode(node),
    }),
  });

  return <div className={cls.richTextDiv} dangerouslySetInnerHTML={{ __html: html }} />;
}
