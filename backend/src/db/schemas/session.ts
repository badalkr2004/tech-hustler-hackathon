import { relations } from 'drizzle-orm';
import { skills } from './skills';
import { users } from './user';
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  index,
  decimal,
} from 'drizzle-orm/pg-core';
import { videoCalls } from './videoCall';
import { reviews } from './review';
import { sessionMaterials } from './sessionMaterial';

// Sessions Table
export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    skillId: uuid('skill_id')
      .references(() => skills.id)
      .notNull(),
    teacherId: uuid('teacher_id')
      .references(() => users.id)
      .notNull(),
    studentId: uuid('student_id')
      .references(() => users.id)
      .notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description'),
    scheduledStartTime: timestamp('scheduled_start_time').notNull(),
    scheduledEndTime: timestamp('scheduled_end_time').notNull(),
    actualStartTime: timestamp('actual_start_time'),
    actualEndTime: timestamp('actual_end_time'),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    // pending, confirmed, in_progress, completed, cancelled, no_show
    cancellationReason: text('cancellation_reason'),
    pricePerHour: decimal('price_per_hour', {
      precision: 8,
      scale: 2,
    }).notNull(),
    totalAmount: decimal('total_amount', { precision: 8, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).default('USD'),
    paymentStatus: varchar('payment_status', { length: 20 }).default('pending'),
    // pending, paid, refunded, failed
    paymentIntentId: varchar('payment_intent_id', { length: 255 }),
    sessionNotes: text('session_notes'),
    studentNotes: text('student_notes'),
    teacherNotes: text('teacher_notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    skillIdx: index('session_skill_idx').on(table.skillId),
    teacherIdx: index('session_teacher_idx').on(table.teacherId),
    studentIdx: index('session_student_idx').on(table.studentId),
    statusIdx: index('session_status_idx').on(table.status),
    scheduledTimeIdx: index('scheduled_time_idx').on(table.scheduledStartTime),
  }),
);

// Sessions Relations
export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  skill: one(skills, {
    fields: [sessions.skillId],
    references: [skills.id],
  }),
  teacher: one(users, {
    fields: [sessions.teacherId],
    references: [users.id],
    relationName: 'teacher',
  }),
  student: one(users, {
    fields: [sessions.studentId],
    references: [users.id],
    relationName: 'student',
  }),
  videoCall: one(videoCalls),
  reviews: many(reviews),
  sessionMaterials: many(sessionMaterials),
}));
