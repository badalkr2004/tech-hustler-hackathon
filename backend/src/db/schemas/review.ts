import { pgTable } from 'drizzle-orm/pg-core';
import {
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';
import { sessions } from './session';
import { skills } from './skills';
import { users } from './user';
import { relations } from 'drizzle-orm';

// Reviews Table
export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: uuid('session_id')
      .references(() => sessions.id)
      .notNull(),
    skillId: uuid('skill_id')
      .references(() => skills.id)
      .notNull(),
    reviewerId: uuid('reviewer_id')
      .references(() => users.id)
      .notNull(),
    revieweeId: uuid('reviewee_id')
      .references(() => users.id)
      .notNull(),
    rating: integer('rating').notNull(), // 1-5 stars
    title: varchar('title', { length: 200 }),
    comment: text('comment'),
    aspectRatings: jsonb('aspect_ratings').$type<{
      knowledge: number;
      communication: number;
      patience: number;
      helpfulness: number;
    }>(),
    wouldRecommend: boolean('would_recommend'),
    isPublic: boolean('is_public').default(true),
    isVerified: boolean('is_verified').default(false),
    teacherResponse: text('teacher_response'),
    teacherResponseAt: timestamp('teacher_response_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    sessionIdx: uniqueIndex('review_session_idx').on(table.sessionId),
    skillIdx: index('review_skill_idx').on(table.skillId),
    revieweeIdx: index('review_reviewee_idx').on(table.revieweeId),
    ratingIdx: index('review_rating_idx').on(table.rating),
  }),
);

// Reviews Relations
export const reviewsRelations = relations(reviews, ({ one }) => ({
  session: one(sessions, {
    fields: [reviews.sessionId],
    references: [sessions.id],
  }),
  skill: one(skills, {
    fields: [reviews.skillId],
    references: [skills.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
    relationName: 'reviewer',
  }),
  reviewee: one(users, {
    fields: [reviews.revieweeId],
    references: [users.id],
    relationName: 'reviewee',
  }),
}));
