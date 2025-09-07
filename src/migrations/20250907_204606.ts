import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-sqlite";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`locations\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`address\` text,
  	\`city\` text DEFAULT 'Cincinnati',
  	\`state\` text DEFAULT 'Ohio',
  	\`country\` text DEFAULT 'USA',
  	\`postal_code\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
  await db.run(sql`CREATE INDEX \`locations_updated_at_idx\` ON \`locations\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX \`locations_created_at_idx\` ON \`locations\` (\`created_at\`);`);

  // Move over existing locations.
  await db.run(sql`
    INSERT INTO \`locations\` (id, name)
    SELECT e.location AS id, e.location AS name
    FROM \`events\` e;
  `);

  await db.run(sql`ALTER TABLE \`events\` ADD \`location_id\` text(36) REFERENCES locations(id);`);
  await db.run(sql`CREATE INDEX \`events_location_idx\` ON \`events\` (\`location_id\`);`);
  await db.run(sql`ALTER TABLE \`events\` ADD \`meet_coordinates_latitude\` numeric;`);
  await db.run(sql`ALTER TABLE \`events\` ADD \`meet_coordinates_longitude\` numeric;`);
  // Populate meet coordinates if we already have them.
  const evs = await payload.find({
    collection: "events",
    select: { mapMeetUrl: true },
    where: { mapMeetUrl: { exists: true } },
  });
  if (evs) {
    for (const ev of evs.docs) {
      const latMatch = ev.mapMeetUrl?.match(/mlat=(-?\d+\.\d+)/);
      const lonMatch = ev.mapMeetUrl?.match(/mlon=(-?\d+\.\d+)/);
      if (!latMatch?.[1] || !lonMatch?.[1]) {
        continue;
      }

      const lat = Number.parseFloat(latMatch[1]);
      const lon = Number.parseFloat(lonMatch[1]);
      if (isNaN(lat) || isNaN(lon)) {
        continue;
      }

      await db.run(sql`
        UPDATE \`events\`
        SET \`meet_coordinates_latitude\` = ${lat},
            \`meet_coordinates_longitude\` = ${lon}
        WHERE id = ${ev.id}
      `);
    }
  }

  // Move over FKs for existing locations
  await db.run(sql`
    UPDATE \`events\`
    SET \`location_id\` = \`location\`;
  `);
  await db.run(sql`ALTER TABLE \`events\` DROP COLUMN \`location\`;`);

  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`locations_id\` text(36) REFERENCES locations(id);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_locations_id_idx\` ON \`payload_locked_documents_rels\` (\`locations_id\`);`,
  );
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`locations\`;`);
  await db.run(sql`PRAGMA foreign_keys=OFF;`);
  await db.run(sql`CREATE TABLE \`__new_events\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`timestamp\` text NOT NULL,
  	\`timestamp_tz\` text NOT NULL,
  	\`location\` text NOT NULL,
  	\`cover_image_id\` text(36),
  	\`difficulty\` text NOT NULL,
  	\`distance\` numeric NOT NULL,
  	\`duration\` text NOT NULL,
  	\`map_embed_url\` text,
  	\`map_meet_url\` text,
  	\`details\` text,
  	\`reactions\` text,
  	\`series_id\` text(36),
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`series_id\`) REFERENCES \`event_series\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`INSERT INTO \`__new_events\`("id", "timestamp", "timestamp_tz", "location", "cover_image_id", "difficulty", "distance", "duration", "map_embed_url", "map_meet_url", "details", "reactions", "series_id", "updated_at", "created_at") SELECT "id", "timestamp", "timestamp_tz", "location_id", "cover_image_id", "difficulty", "distance", "duration", "map_embed_url", "map_meet_url", "details", "reactions", "series_id", "updated_at", "created_at" FROM \`events\`;`,
  );
  await db.run(sql`DROP TABLE \`events\`;`);
  await db.run(sql`ALTER TABLE \`__new_events\` RENAME TO \`events\`;`);
  await db.run(sql`PRAGMA foreign_keys=ON;`);
  await db.run(sql`CREATE INDEX \`events_cover_image_idx\` ON \`events\` (\`cover_image_id\`);`);
  await db.run(sql`CREATE INDEX \`events_series_idx\` ON \`events\` (\`series_id\`);`);
  await db.run(sql`CREATE INDEX \`events_updated_at_idx\` ON \`events\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX \`events_created_at_idx\` ON \`events\` (\`created_at\`);`);
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`announcements_id\` text(36),
  	\`event_series_id\` text(36),
  	\`events_id\` text(36),
  	\`media_id\` text(36),
  	\`users_id\` text(36),
  	\`websites_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`announcements_id\`) REFERENCES \`announcements\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`event_series_id\`) REFERENCES \`event_series\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`websites_id\`) REFERENCES \`websites\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "announcements_id", "event_series_id", "events_id", "media_id", "users_id", "websites_id") SELECT "id", "order", "parent_id", "path", "announcements_id", "event_series_id", "events_id", "media_id", "users_id", "websites_id" FROM \`payload_locked_documents_rels\`;`,
  );
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`);
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`);
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_announcements_id_idx\` ON \`payload_locked_documents_rels\` (\`announcements_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_event_series_id_idx\` ON \`payload_locked_documents_rels\` (\`event_series_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_events_id_idx\` ON \`payload_locked_documents_rels\` (\`events_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_websites_id_idx\` ON \`payload_locked_documents_rels\` (\`websites_id\`);`,
  );
}
