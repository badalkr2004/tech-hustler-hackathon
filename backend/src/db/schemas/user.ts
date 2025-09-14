import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  uuid,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { skills } from './skills';
import { sessions } from './session';
import { messages } from './message';
import { reviews } from './review';
import { notifications } from './notification';

// Users Table
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    bio: text('bio'),
    profileImage: varchar('profile_image', { length: 500 }),
    location: varchar('location', { length: 200 }),
    timezone: varchar('timezone', { length: 50 }).default('UTC'),
    phoneNumber: varchar('phone_number', { length: 20 }),
    dateOfBirth: timestamp('date_of_birth'),
    averageRating: decimal('average_rating', {
      precision: 3,
      scale: 2,
    }).default('0.00'),
    totalReviews: integer('total_reviews').default(0),
    totalEarnings: decimal('total_earnings', {
      precision: 10,
      scale: 2,
    }).default('0.00'),
    isVerified: boolean('is_verified').default(false),
    isActive: boolean('is_active').default(true),
    lastSeen: timestamp('last_seen').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
    usernameIdx: index('username_idx').on(table.username),
    locationIdx: index('location_idx').on(table.location),
  }),
);

// User Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  skillsOffered: many(skills),
  sessionsAsTeacher: many(sessions, { relationName: 'teacher' }),
  sessionsAsStudent: many(sessions, { relationName: 'student' }),
  sentMessages: many(messages, { relationName: 'sender' }),
  receivedMessages: many(messages, { relationName: 'receiver' }),
  reviewsGiven: many(reviews, { relationName: 'reviewer' }),
  reviewsReceived: many(reviews, { relationName: 'reviewee' }),
  teacherProfile: one(teacherProfiles),
  notifications: many(notifications),
}));

export const teacherProfiles = pgTable('teacher_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull()
    .unique(),
  experience: text('experience'),
  education: jsonb('education').$type<
    {
      degree: string;
      institution: string;
      year: number;
    }[]
  >(),
  certifications: jsonb('certifications').$type<
    {
      name: string;
      issuer: string;
      year: number;
      url?: string;
    }[]
  >(),
  languages: jsonb('languages').$type<
    {
      language: string;
      proficiency: string;
    }[]
  >(),
  achievements: jsonb('achievements').$type<string[]>(),
  socialLinks: jsonb('social_links').$type<
    {
      platform: string;
      url: string;
    }[]
  >(),
  hourlyRate: decimal('hourly_rate', { precision: 8, scale: 2 }),
  responseTime: integer('response_time').default(24), // in hours
  completedSessions: integer('completed_sessions').default(0),
  totalStudents: integer('total_students').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Teacher Profile Relations
export const teacherProfilesRelations = relations(
  teacherProfiles,
  ({ one }) => ({
    user: one(users, {
      fields: [teacherProfiles.userId],
      references: [users.id],
    }),
  }),
);
