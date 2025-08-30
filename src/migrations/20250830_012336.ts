import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`announcements\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`kind\` text NOT NULL,
  	\`event_id\` text(36),
  	\`event_series_id\` text(36),
  	\`title\` text NOT NULL,
  	\`content\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`event_series_id\`) REFERENCES \`event_series\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`announcements_event_idx\` ON \`announcements\` (\`event_id\`);`)
  await db.run(sql`CREATE INDEX \`announcements_event_series_idx\` ON \`announcements\` (\`event_series_id\`);`)
  await db.run(sql`CREATE INDEX \`announcements_updated_at_idx\` ON \`announcements\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`announcements_created_at_idx\` ON \`announcements\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`events_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`href\` text NOT NULL,
  	\`text\` text,
  	\`website_id\` text(36),
  	FOREIGN KEY (\`website_id\`) REFERENCES \`websites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`events_links_order_idx\` ON \`events_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`events_links_parent_id_idx\` ON \`events_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`events_links_website_idx\` ON \`events_links\` (\`website_id\`);`)
  await db.run(sql`CREATE TABLE \`events_comments\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`author\` text NOT NULL,
  	\`reactions\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`events_comments_order_idx\` ON \`events_comments\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`events_comments_parent_id_idx\` ON \`events_comments\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`websites\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`url\` text NOT NULL,
  	\`logo_id\` text(36),
  	\`monochrome_icon_svg\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`websites_logo_idx\` ON \`websites\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`websites_updated_at_idx\` ON \`websites\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`websites_created_at_idx\` ON \`websites\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`events\` ADD \`details\` text;`)
  await db.run(sql`ALTER TABLE \`events\` ADD \`reactions\` text;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`announcements_id\` text(36) REFERENCES announcements(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`websites_id\` text(36) REFERENCES websites(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_announcements_id_idx\` ON \`payload_locked_documents_rels\` (\`announcements_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_websites_id_idx\` ON \`payload_locked_documents_rels\` (\`websites_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`announcements\`;`)
  await db.run(sql`DROP TABLE \`events_links\`;`)
  await db.run(sql`DROP TABLE \`events_comments\`;`)
  await db.run(sql`DROP TABLE \`websites\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` text(36),
  	\`media_id\` text(36),
  	\`events_id\` text(36),
  	\`event_series_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`event_series_id\`) REFERENCES \`event_series\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "events_id", "event_series_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "events_id", "event_series_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_events_id_idx\` ON \`payload_locked_documents_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_event_series_id_idx\` ON \`payload_locked_documents_rels\` (\`event_series_id\`);`)
  await db.run(sql`ALTER TABLE \`events\` DROP COLUMN \`details\`;`)
  await db.run(sql`ALTER TABLE \`events\` DROP COLUMN \`reactions\`;`)
}
