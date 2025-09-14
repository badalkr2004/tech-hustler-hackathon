import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  integer,
} from 'drizzle-orm/pg-core';
import { sessions } from './session';
import { users } from './user';
import { relations } from 'drizzle-orm';

// Session Materials Table
export const sessionMaterials = pgTable(
  'session_materials',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: uuid('session_id')
      .references(() => sessions.id)
      .notNull(),
    uploadedBy: uuid('uploaded_by')
      .references(() => users.id)
      .notNull(),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    fileUrl: varchar('file_url', { length: 500 }).notNull(),
    fileType: varchar('file_type', { length: 50 }).notNull(),
    fileSize: integer('file_size').notNull(),
    description: text('description'),
    isPublic: boolean('is_public').default(false),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    sessionIdx: index('material_session_idx').on(table.sessionId),
    uploaderIdx: index('material_uploader_idx').on(table.uploadedBy),
  }),
);

// Session Materials Relations
export const sessionMaterialsRelations = relations(
  sessionMaterials,
  ({ one }) => ({
    session: one(sessions, {
      fields: [sessionMaterials.sessionId],
      references: [sessions.id],
    }),
    uploader: one(users, {
      fields: [sessionMaterials.uploadedBy],
      references: [users.id],
    }),
  }),
);
