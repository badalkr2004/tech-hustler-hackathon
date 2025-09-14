import { relations } from 'drizzle-orm';
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
  uniqueIndex,
  jsonb,
} from 'drizzle-orm/pg-core';
import { sessions } from './session';

// Video Calls Table (Stream/Mux Integration)
export const videoCalls = pgTable(
  'video_calls',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: uuid('session_id')
      .references(() => sessions.id)
      .notNull()
      .unique(),
    provider: varchar('provider', { length: 20 }).notNull().default('mux'), // mux, stream, zoom
    roomId: varchar('room_id', { length: 255 }).notNull(),
    roomUrl: varchar('room_url', { length: 500 }),
    streamKey: varchar('stream_key', { length: 255 }),
    playbackId: varchar('playback_id', { length: 255 }),
    recordingEnabled: boolean('recording_enabled').default(false),
    recordingUrl: varchar('recording_url', { length: 500 }),
    recordingStatus: varchar('recording_status', { length: 20 }).default(
      'disabled',
    ),
    // disabled, recording, processing, ready, failed
    maxDuration: integer('max_duration').default(7200), // in seconds (2 hours default)
    actualDuration: integer('actual_duration'), // in seconds
    connectionQuality: jsonb('connection_quality').$type<{
      teacher: { bitrate: number; latency: number; packetLoss: number };
      student: { bitrate: number; latency: number; packetLoss: number };
    }>(),
    callStartedAt: timestamp('call_started_at'),
    callEndedAt: timestamp('call_ended_at'),
    isActive: boolean('is_active').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    sessionIdx: uniqueIndex('video_call_session_idx').on(table.sessionId),
    roomIdx: index('video_call_room_idx').on(table.roomId),
    providerIdx: index('video_call_provider_idx').on(table.provider),
  }),
);

// Video Calls Relations
export const videoCallsRelations = relations(videoCalls, ({ one }) => ({
  session: one(sessions, {
    fields: [videoCalls.sessionId],
    references: [sessions.id],
  }),
}));

// Call Participants Table (For tracking who joined when)
export const callParticipants = pgTable(
  'call_participants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    videoCallId: uuid('video_call_id')
      .references(() => videoCalls.id)
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    role: varchar('role', { length: 20 }).notNull(), // teacher, student
    joinedAt: timestamp('joined_at'),
    leftAt: timestamp('left_at'),
    connectionId: varchar('connection_id', { length: 255 }),
    deviceInfo: jsonb('device_info').$type<{
      browser: string;
      os: string;
      device: string;
      camera: boolean;
      microphone: boolean;
    }>(),
    qualityMetrics: jsonb('quality_metrics').$type<{
      avgBitrate: number;
      avgLatency: number;
      packetLoss: number;
      disconnections: number;
    }>(),
  },
  (table) => ({
    videoCallIdx: index('participant_call_idx').on(table.videoCallId),
    userIdx: index('participant_user_idx').on(table.userId),
  }),
);

// Call Participants Relations
export const callParticipantsRelations = relations(
  callParticipants,
  ({ one }) => ({
    videoCall: one(videoCalls, {
      fields: [callParticipants.videoCallId],
      references: [videoCalls.id],
    }),
    user: one(users, {
      fields: [callParticipants.userId],
      references: [users.id],
    }),
  }),
);
