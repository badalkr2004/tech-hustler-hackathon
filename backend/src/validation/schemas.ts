// validation/schemas.ts
import { z } from 'zod';

// User Schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens',
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name too long'),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100).optional(),
  lastName: z.string().min(1, 'Last name is required').max(100).optional(),
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
  location: z.string().max(200).optional(),
  timezone: z.string().max(50).optional(),
  phoneNumber: z.string().max(20).optional(),
  profileImage: z.string().url('Invalid image URL').optional(),
});

// Teacher Profile Schema
export const createTeacherProfileSchema = z.object({
  experience: z
    .string()
    .max(2000, 'Experience description too long')
    .optional(),
  education: z
    .array(
      z.object({
        degree: z.string().min(1, 'Degree is required'),
        institution: z.string().min(1, 'Institution is required'),
        year: z.number().min(1950).max(new Date().getFullYear()),
      }),
    )
    .optional(),
  certifications: z
    .array(
      z.object({
        name: z.string().min(1, 'Certification name is required'),
        issuer: z.string().min(1, 'Issuer is required'),
        year: z.number().min(1950).max(new Date().getFullYear()),
        url: z.string().url().optional(),
      }),
    )
    .optional(),
  languages: z
    .array(
      z.object({
        language: z.string().min(1, 'Language is required'),
        proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'native']),
      }),
    )
    .optional(),
  achievements: z.array(z.string()).optional(),
  socialLinks: z
    .array(
      z.object({
        platform: z.string().min(1, 'Platform is required'),
        url: z.string().url('Invalid URL'),
      }),
    )
    .optional(),
  hourlyRate: z.number().positive('Hourly rate must be positive').optional(),
  responseTime: z
    .number()
    .positive('Response time must be positive')
    .optional(),
});

// Skill Schemas
export const createSkillSchema = z.object({
  categoryId: z.string().uuid('Invalid category ID'),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title too long'),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description too long'),
  shortDescription: z
    .string()
    .max(500, 'Short description too long')
    .optional(),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  duration: z
    .number()
    .min(15, 'Duration must be at least 15 minutes')
    .max(480, 'Duration cannot exceed 8 hours'),
  maxStudents: z
    .number()
    .min(1, 'Must allow at least 1 student')
    .max(20, 'Cannot exceed 20 students'),
  pricePerHour: z
    .number()
    .positive('Price must be positive')
    .max(1000, 'Price cannot exceed $1000/hour'),
  currency: z
    .string()
    .length(3, 'Currency must be 3 characters')
    .default('USD'),
  prerequisites: z.array(z.string()).optional(),
  whatYouLearn: z
    .array(z.string().min(1, 'Learning outcome cannot be empty'))
    .min(1, 'Must have at least one learning outcome'),
  materials: z.array(z.string()).optional(),
  tags: z
    .array(z.string().min(1, 'Tag cannot be empty'))
    .max(10, 'Cannot have more than 10 tags')
    .optional(),
  thumbnailImage: z.string().url('Invalid image URL').optional(),
  gallery: z
    .array(z.string().url('Invalid image URL'))
    .max(5, 'Cannot have more than 5 images')
    .optional(),
});

export const updateSkillSchema = createSkillSchema.partial();

// Availability Schemas
export const createAvailabilitySchema = z
  .object({
    skillId: z.string().uuid('Invalid skill ID'),
    dayOfWeek: z.number().min(0, 'Invalid day').max(6, 'Invalid day'),
    startTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Invalid time format (HH:MM)',
      ),
    endTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Invalid time format (HH:MM)',
      ),
    isRecurring: z.boolean().default(true),
    specificDate: z.string().datetime().optional(),
    maxBookings: z
      .number()
      .min(1, 'Must allow at least 1 booking')
      .max(10, 'Cannot exceed 10 bookings')
      .default(1),
  })
  .refine(
    (data) => {
      const start = data.startTime.split(':').map(Number);
      const end = data.endTime.split(':').map(Number);
      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];
      return endMinutes > startMinutes;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    },
  );

export const updateAvailabilitySchema = createAvailabilitySchema
  .partial()
  .omit({ skillId: true });

// Session Schemas
export const createSessionSchema = z
  .object({
    skillId: z.string().uuid('Invalid skill ID'),
    teacherId: z.string().uuid('Invalid teacher ID'),
    scheduledStartTime: z.string().datetime('Invalid start time'),
    scheduledEndTime: z.string().datetime('Invalid end time'),
    studentNotes: z.string().max(1000, 'Notes too long').optional(),
  })
  .refine(
    (data) => {
      const startTime = new Date(data.scheduledStartTime);
      const endTime = new Date(data.scheduledEndTime);
      const now = new Date();

      // Check if start time is in the future
      if (startTime <= now) return false;

      // Check if end time is after start time
      if (endTime <= startTime) return false;

      // Check if session duration is reasonable (15 minutes to 8 hours)
      const durationMs = endTime.getTime() - startTime.getTime();
      const durationMinutes = durationMs / (1000 * 60);
      return durationMinutes >= 15 && durationMinutes <= 480;
    },
    {
      message: 'Invalid session timing',
    },
  );

export const updateSessionStatusSchema = z.object({
  status: z.enum([
    'pending',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
    'no_show',
  ]),
  cancellationReason: z
    .string()
    .max(500, 'Cancellation reason too long')
    .optional(),
  sessionNotes: z.string().max(2000, 'Session notes too long').optional(),
  teacherNotes: z.string().max(2000, 'Teacher notes too long').optional(),
});

// Video Call Schemas
export const createVideoCallSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  provider: z.enum(['mux', 'stream']).default('mux'),
  recordingEnabled: z.boolean().default(false),
  maxDuration: z
    .number()
    .min(300, 'Minimum duration is 5 minutes')
    .max(14400, 'Maximum duration is 4 hours')
    .default(7200),
});

export const updateVideoCallSchema = z.object({
  roomUrl: z.string().url('Invalid room URL').optional(),
  streamKey: z.string().optional(),
  playbackId: z.string().optional(),
  recordingUrl: z.string().url('Invalid recording URL').optional(),
  recordingStatus: z
    .enum(['disabled', 'recording', 'processing', 'ready', 'failed'])
    .optional(),
  actualDuration: z.number().positive('Duration must be positive').optional(),
  connectionQuality: z
    .object({
      teacher: z.object({
        bitrate: z.number().positive(),
        latency: z.number().positive(),
        packetLoss: z.number().min(0).max(100),
      }),
      student: z.object({
        bitrate: z.number().positive(),
        latency: z.number().positive(),
        packetLoss: z.number().min(0).max(100),
      }),
    })
    .optional(),
  callStartedAt: z.string().datetime().optional(),
  callEndedAt: z.string().datetime().optional(),
});

// Call Participant Schema
export const joinCallSchema = z.object({
  videoCallId: z.string().uuid('Invalid video call ID'),
  deviceInfo: z.object({
    browser: z.string().min(1, 'Browser info required'),
    os: z.string().min(1, 'OS info required'),
    device: z.string().min(1, 'Device info required'),
    camera: z.boolean(),
    microphone: z.boolean(),
  }),
});

export const updateParticipantSchema = z.object({
  leftAt: z.string().datetime().optional(),
  qualityMetrics: z
    .object({
      avgBitrate: z.number().positive(),
      avgLatency: z.number().positive(),
      packetLoss: z.number().min(0).max(100),
      disconnections: z.number().min(0),
    })
    .optional(),
});

// Message Schemas
export const createMessageSchema = z.object({
  receiverId: z.string().uuid('Invalid receiver ID'),
  sessionId: z.string().uuid('Invalid session ID').optional(),
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message too long'),
  messageType: z
    .enum(['text', 'image', 'file', 'system', 'video_call_invite'])
    .default('text'),
  attachments: z
    .array(
      z.object({
        fileName: z.string().min(1, 'File name required'),
        fileUrl: z.string().url('Invalid file URL'),
        fileType: z.string().min(1, 'File type required'),
        fileSize: z
          .number()
          .positive('File size must be positive')
          .max(50 * 1024 * 1024, 'File size cannot exceed 50MB'),
      }),
    )
    .max(5, 'Cannot attach more than 5 files')
    .optional(),
  replyToId: z.string().uuid('Invalid reply message ID').optional(),
});

export const updateMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message too long'),
});

export const markMessageReadSchema = z.object({
  messageIds: z
    .array(z.string().uuid('Invalid message ID'))
    .min(1, 'Must provide at least one message ID'),
});

// Review Schemas
export const createReviewSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  title: z.string().max(200, 'Title too long').optional(),
  comment: z.string().max(2000, 'Comment too long').optional(),
  aspectRatings: z
    .object({
      knowledge: z.number().min(1).max(5),
      communication: z.number().min(1).max(5),
      patience: z.number().min(1).max(5),
      helpfulness: z.number().min(1).max(5),
    })
    .optional(),
  wouldRecommend: z.boolean().optional(),
  isPublic: z.boolean().default(true),
});

export const teacherResponseSchema = z.object({
  teacherResponse: z
    .string()
    .min(1, 'Response cannot be empty')
    .max(1000, 'Response too long'),
});

// Session Material Schemas
export const uploadSessionMaterialSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  fileName: z
    .string()
    .min(1, 'File name required')
    .max(255, 'File name too long'),
  fileUrl: z.string().url('Invalid file URL'),
  fileType: z
    .string()
    .min(1, 'File type required')
    .max(50, 'File type too long'),
  fileSize: z
    .number()
    .positive('File size must be positive')
    .max(100 * 1024 * 1024, 'File size cannot exceed 100MB'),
  description: z.string().max(500, 'Description too long').optional(),
  isPublic: z.boolean().default(false),
});

// Notification Schemas
export const createNotificationSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  type: z.enum([
    'session_booked',
    'session_confirmed',
    'session_cancelled',
    'session_starting',
    'session_completed',
    'review_received',
    'message_received',
    'payment_received',
    'payment_failed',
    'skill_approved',
    'skill_rejected',
  ]),
  title: z.string().min(1, 'Title required').max(200, 'Title too long'),
  message: z.string().min(1, 'Message required').max(1000, 'Message too long'),
  actionUrl: z.string().url('Invalid action URL').optional(),
  metadata: z
    .object({
      sessionId: z.string().uuid().optional(),
      messageId: z.string().uuid().optional(),
      reviewId: z.string().uuid().optional(),
      skillId: z.string().uuid().optional(),
      amount: z.number().optional(),
    })
    .optional(),
});

export const markNotificationReadSchema = z.object({
  notificationIds: z
    .array(z.string().uuid('Invalid notification ID'))
    .min(1, 'Must provide at least one notification ID'),
});

// Payment Schemas
export const createPaymentSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  amount: z.number().positive('Amount must be positive'),
  currency: z
    .string()
    .length(3, 'Currency must be 3 characters')
    .default('USD'),
  paymentMethod: z.string().min(1, 'Payment method required'),
});

export const updatePaymentStatusSchema = z.object({
  status: z.enum([
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded',
    'cancelled',
  ]),
  paymentIntentId: z.string().optional(),
  stripeChargeId: z.string().optional(),
  failureReason: z.string().max(500, 'Failure reason too long').optional(),
  processedAt: z.string().datetime().optional(),
});

export const refundPaymentSchema = z.object({
  refundAmount: z
    .number()
    .positive('Refund amount must be positive')
    .optional(),
  reason: z
    .string()
    .min(1, 'Refund reason required')
    .max(500, 'Reason too long'),
});

// Search and Filter Schemas
export const searchSkillsSchema = z
  .object({
    query: z.string().max(100, 'Search query too long').optional(),
    categoryId: z.string().uuid('Invalid category ID').optional(),
    skillLevel: z
      .enum(['beginner', 'intermediate', 'advanced', 'expert'])
      .optional(),
    minPrice: z.number().min(0, 'Price cannot be negative').optional(),
    maxPrice: z.number().min(0, 'Price cannot be negative').optional(),
    location: z.string().max(200, 'Location too long').optional(),
    tags: z
      .array(z.string().min(1, 'Tag cannot be empty'))
      .max(10, 'Too many tags')
      .optional(),
    sortBy: z
      .enum(['relevance', 'price_asc', 'price_desc', 'rating', 'newest'])
      .default('relevance'),
    page: z.number().min(1, 'Page must be at least 1').default(1),
    limit: z
      .number()
      .min(1, 'Limit must be at least 1')
      .max(50, 'Limit cannot exceed 50')
      .default(20),
  })
  .refine(
    (data) => {
      if (data.minPrice && data.maxPrice && data.minPrice > data.maxPrice) {
        return false;
      }
      return true;
    },
    {
      message: 'Minimum price cannot be greater than maximum price',
      path: ['maxPrice'],
    },
  );

export const searchUsersSchema = z.object({
  query: z.string().max(100, 'Search query too long').optional(),
  location: z.string().max(200, 'Location too long').optional(),
  skills: z
    .array(z.string().min(1, 'Skill cannot be empty'))
    .max(10, 'Too many skills')
    .optional(),
  minRating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5')
    .optional(),
  sortBy: z
    .enum(['relevance', 'rating', 'newest', 'experience'])
    .default('relevance'),
  page: z.number().min(1, 'Page must be at least 1').default(1),
  limit: z
    .number()
    .min(1, 'Limit must be at least 1')
    .max(50, 'Limit cannot exceed 50')
    .default(20),
});

// Category Schema
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name required').max(100, 'Name too long'),
  slug: z
    .string()
    .min(1, 'Slug required')
    .max(100, 'Slug too long')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens',
    ),
  description: z.string().max(500, 'Description too long').optional(),
  icon: z.string().max(100, 'Icon name too long').optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1').default(1),
  limit: z
    .number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(20),
});

// Date Range Schema
export const dateRangeSchema = z
  .object({
    startDate: z.string().datetime('Invalid start date'),
    endDate: z.string().datetime('Invalid end date'),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    },
  );

// File Upload Schema
export const fileUploadSchema = z.object({
  fileName: z
    .string()
    .min(1, 'File name required')
    .max(255, 'File name too long'),
  fileType: z.string().min(1, 'File type required'),
  fileSize: z
    .number()
    .positive('File size must be positive')
    .max(100 * 1024 * 1024, 'File size cannot exceed 100MB'),
});

// Bulk Operations Schema
export const bulkDeleteSchema = z.object({
  ids: z
    .array(z.string().uuid('Invalid ID'))
    .min(1, 'Must provide at least one ID')
    .max(50, 'Cannot delete more than 50 items at once'),
});

export const bulkUpdateSchema = z.object({
  ids: z
    .array(z.string().uuid('Invalid ID'))
    .min(1, 'Must provide at least one ID')
    .max(50, 'Cannot update more than 50 items at once'),
  updates: z.record(z.any(), z.any()),
});

// Webhook Schema (for external integrations)
export const webhookSchema = z.object({
  event: z.string().min(1, 'Event type required'),
  data: z.record(z.any(), z.any()),
  timestamp: z.string().datetime(),
  signature: z.string().min(1, 'Signature required'),
});

// Analytics Schema
export const analyticsQuerySchema = z
  .object({
    startDate: z.string().datetime('Invalid start date'),
    endDate: z.string().datetime('Invalid end date'),
    granularity: z.enum(['hour', 'day', 'week', 'month']).default('day'),
    metrics: z
      .array(z.enum(['sessions', 'revenue', 'users', 'skills', 'reviews']))
      .min(1, 'Must specify at least one metric'),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const now = new Date();

      // Check if end date is not in the future
      if (end > now) return false;

      // Check if date range is reasonable (not more than 1 year)
      const oneYear = 365 * 24 * 60 * 60 * 1000;
      return end.getTime() - start.getTime() <= oneYear;
    },
    {
      message: 'Invalid date range',
    },
  );

// Export all schemas for easy importing
export const schemas = {
  // User schemas
  createUserSchema,
  loginSchema,
  updateUserProfileSchema,
  createTeacherProfileSchema,

  // Skill schemas
  createSkillSchema,
  updateSkillSchema,
  createAvailabilitySchema,
  updateAvailabilitySchema,

  // Session schemas
  createSessionSchema,
  updateSessionStatusSchema,

  // Video call schemas
  createVideoCallSchema,
  updateVideoCallSchema,
  joinCallSchema,
  updateParticipantSchema,

  // Message schemas
  createMessageSchema,
  updateMessageSchema,
  markMessageReadSchema,

  // Review schemas
  createReviewSchema,
  teacherResponseSchema,

  // Material schemas
  uploadSessionMaterialSchema,

  // Notification schemas
  createNotificationSchema,
  markNotificationReadSchema,

  // Payment schemas
  createPaymentSchema,
  updatePaymentStatusSchema,
  refundPaymentSchema,

  // Search schemas
  searchSkillsSchema,
  searchUsersSchema,

  // Category schemas
  createCategorySchema,
  updateCategorySchema,

  // Utility schemas
  paginationSchema,
  dateRangeSchema,
  fileUploadSchema,
  bulkDeleteSchema,
  bulkUpdateSchema,
  webhookSchema,
  analyticsQuerySchema,
};
