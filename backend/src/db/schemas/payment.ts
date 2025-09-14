import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
  decimal,
} from 'drizzle-orm/pg-core';
import { sessions } from './session';
import { users } from './user';
import { relations } from 'drizzle-orm';

// Payment Transactions Table
export const paymentTransactions = pgTable(
  'payment_transactions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionId: uuid('session_id')
      .references(() => sessions.id)
      .notNull(),
    payerId: uuid('payer_id')
      .references(() => users.id)
      .notNull(),
    payeeId: uuid('payee_id')
      .references(() => users.id)
      .notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).default('USD'),
    platformFee: decimal('platform_fee', { precision: 10, scale: 2 }).default(
      '0.00',
    ),
    netAmount: decimal('net_amount', { precision: 10, scale: 2 }).notNull(),
    paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
    paymentIntentId: varchar('payment_intent_id', { length: 255 }),
    stripeChargeId: varchar('stripe_charge_id', { length: 255 }),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    // pending, processing, completed, failed, refunded, cancelled
    failureReason: text('failure_reason'),
    processedAt: timestamp('processed_at'),
    refundedAt: timestamp('refunded_at'),
    refundAmount: decimal('refund_amount', { precision: 10, scale: 2 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    sessionIdx: index('payment_session_idx').on(table.sessionId),
    payerIdx: index('payment_payer_idx').on(table.payerId),
    payeeIdx: index('payment_payee_idx').on(table.payeeId),
    statusIdx: index('payment_status_idx').on(table.status),
  }),
);

// Payment Transactions Relations
export const paymentTransactionsRelations = relations(
  paymentTransactions,
  ({ one }) => ({
    session: one(sessions, {
      fields: [paymentTransactions.sessionId],
      references: [sessions.id],
    }),
    payer: one(users, {
      fields: [paymentTransactions.payerId],
      references: [users.id],
      relationName: 'payer',
    }),
    payee: one(users, {
      fields: [paymentTransactions.payeeId],
      references: [users.id],
      relationName: 'payee',
    }),
  }),
);
