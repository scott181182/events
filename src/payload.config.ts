// storage-adapter-import-placeholder
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Events } from "./collections/Events";
import { EventSeries } from "./collections/EventSeries";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.SERVER_URL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Events, EventSeries],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "",
    },
    idType: "uuid",
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
});
