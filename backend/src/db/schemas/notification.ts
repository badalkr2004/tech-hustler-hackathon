import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  jsonb,
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { relations } from 'drizzle-orm';

// Notifications Table
export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    type: varchar('type', { length: 50 }).notNull(),
    // session_booked, session_confirmed, session_cancelled, session_starting,
    // session_completed, review_received, message_received, payment_received
    title: varchar('title', { length: 200 }).notNull(),
    message: text('message').notNull(),
    actionUrl: varchar('action_url', { length: 500 }),
    metadata: jsonb('metadata').$type<{
      sessionId?: string;
      messageId?: string;
      reviewId?: string;
    }>(),
    isRead: boolean('is_read').default(false),
    readAt: timestamp('read_at'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    userIdx: index('notification_user_idx').on(table.userId),
    typeIdx: index('notification_type_idx').on(table.type),
    isReadIdx: index('notification_read_idx').on(table.isRead),
    createdAtIdx: index('notification_created_idx').on(table.createdAt),
  }),
);

// Notifications Relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
