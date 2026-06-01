const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true, // Automatically convert email to lowercase
      trim: true, // Remove leading/trailing whitespace
    },
    password: {
      type: String,
      required: false, // Changed to false for Google OAuth
    },
    fullName: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
    role: {
      type: String,
      enum: ['GENERAL', 'ADMIN', 'HR', 'LOGISTICS_ASSOCIATE'],
      default: 'GENERAL',
    },
    status: {
      type: String,
      default: 'Active', // Default status
    },
    location: {
      type: String,
      default: 'Not Specified', // Default location
    },isVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
    measurements: {
      jacketSuit: { type: mongoose.Schema.Types.Mixed, default: {} },
      trouser: { type: mongoose.Schema.Types.Mixed, default: {} },
      nativeTop: { type: mongoose.Schema.Types.Mixed, default: {} },
      nativeTrouser: { type: mongoose.Schema.Types.Mixed, default: {} },
      shirt: { type: mongoose.Schema.Types.Mixed, default: {} },
      shoes: { type: mongoose.Schema.Types.Mixed, default: {} },
      updatedAt: { type: Date },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure case-insensitive uniqueness for email
userSchema.path('email').index({ unique: true });

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;


