import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  jsonb,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { sessions } from './session';
import { relations } from 'drizzle-orm';

// Messages Table
export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id').notNull(),
    senderId: uuid('sender_id')
      .references(() => users.id)
      .notNull(),
    receiverId: uuid('receiver_id')
      .references(() => users.id)
      .notNull(),
    sessionId: uuid('session_id').references(() => sessions.id),
    content: text('content').notNull(),
    messageType: varchar('message_type', { length: 20 }).default('text'),
    attachments: jsonb('attachments').$type<
      {
        fileName: string;
        fileUrl: string;
        fileType: string;
        fileSize: number;
      }[]
    >(),
    isRead: boolean('is_read').default(false),
    readAt: timestamp('read_at'),
    isEdited: boolean('is_edited').default(false),
    editedAt: timestamp('edited_at'),
    replyToId: uuid('reply_to_id'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    conversationIdx: index('message_conversation_idx').on(table.conversationId),
    senderIdx: index('message_sender_idx').on(table.senderId),
    receiverIdx: index('message_receiver_idx').on(table.receiverId),
    sessionIdx: index('message_session_idx').on(table.sessionId),
    createdAtIdx: index('message_created_idx').on(table.createdAt),
    replyToIdx: index('message_reply_to_idx').on(table.replyToId),
    // Self-referencing foreign key constraint
    replyToFk: foreignKey({
      columns: [table.replyToId],
      foreignColumns: [table.id],
    }),
  }),
);

// Messages Relations
export const messagesRelations = relations(messages, ({ one, many }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: 'receiver',
  }),
  session: one(sessions, {
    fields: [messages.sessionId],
    references: [sessions.id],
  }),
  replyTo: one(messages, {
    fields: [messages.replyToId],
    references: [messages.id],
    relationName: 'replyTo',
  }),
  replies: many(messages, {
    relationName: 'replyTo',
  }),
}));
