// storage-adapter-import-placeholder
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import * as collections from "./collections";
import { migrations } from "./migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.SERVER_URL,
  admin: {
    user: collections.Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: Object.values(collections),
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "",
    },
    idType: "uuid",
    prodMigrations: migrations,
    migrationDir: "./src/migrations",
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
});
