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
} from 'drizzle-orm/pg-core';

// Availability Table
export const availability = pgTable(
  'availability',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    skillId: uuid('skill_id')
      .references(() => skills.id)
      .notNull(),
    teacherId: uuid('teacher_id')
      .references(() => users.id)
      .notNull(),
    dayOfWeek: integer('day_of_week').notNull(), // 0 = Sunday, 1 = Monday, etc.
    startTime: varchar('start_time', { length: 5 }).notNull(), // HH:MM format
    endTime: varchar('end_time', { length: 5 }).notNull(), // HH:MM format
    isRecurring: boolean('is_recurring').default(true),
    specificDate: timestamp('specific_date'), // For one-time availability
    maxBookings: integer('max_bookings').default(1),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    skillIdx: index('skill_availability_idx').on(table.skillId),
    teacherIdx: index('teacher_availability_idx').on(table.teacherId),
    dayIdx: index('day_availability_idx').on(table.dayOfWeek),
  }),
);

// Availability Relations
export const availabilityRelations = relations(availability, ({ one }) => ({
  skill: one(skills, {
    fields: [availability.skillId],
    references: [skills.id],
  }),
  teacher: one(users, {
    fields: [availability.teacherId],
    references: [users.id],
  }),
}));
