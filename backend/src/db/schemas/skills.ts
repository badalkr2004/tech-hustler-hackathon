import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  decimal,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { relations } from 'drizzle-orm';
import { categories } from './category';
import { sessions } from './session';
import { reviews } from './review';
import { availability } from './availability';

// Skills Table
export const skills = pgTable(
  'skills',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teacherId: uuid('teacher_id')
      .references(() => users.id)
      .notNull(),
    categoryId: uuid('category_id')
      .references(() => categories.id)
      .notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description').notNull(),
    shortDescription: varchar('short_description', { length: 500 }),
    skillLevel: varchar('skill_level', { length: 50 }).notNull(), // beginner, intermediate, advanced
    duration: integer('duration').notNull(), // in minutes
    maxStudents: integer('max_students').default(1),
    pricePerHour: decimal('price_per_hour', {
      precision: 8,
      scale: 2,
    }).notNull(),
    currency: varchar('currency', { length: 3 }).default('USD'),
    prerequisites: jsonb('prerequisites').$type<string[]>(),
    whatYouLearn: jsonb('what_you_learn').$type<string[]>(),
    materials: jsonb('materials').$type<string[]>(),
    tags: jsonb('tags').$type<string[]>(),
    thumbnailImage: varchar('thumbnail_image', { length: 500 }),
    gallery: jsonb('gallery').$type<string[]>(),
    isActive: boolean('is_active').default(true),
    averageRating: decimal('average_rating', {
      precision: 3,
      scale: 2,
    }).default('0.00'),
    totalSessions: integer('total_sessions').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    teacherIdx: index('teacher_idx').on(table.teacherId),
    categoryIdx: index('category_idx').on(table.categoryId),
    skillLevelIdx: index('skill_level_idx').on(table.skillLevel),
    priceIdx: index('price_idx').on(table.pricePerHour),
  }),
);

// Skills Relations
export const skillsRelations = relations(skills, ({ one, many }) => ({
  teacher: one(users, {
    fields: [skills.teacherId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [skills.categoryId],
    references: [categories.id],
  }),
  sessions: many(sessions),
  reviews: many(reviews),
  availability: many(availability),
}));
