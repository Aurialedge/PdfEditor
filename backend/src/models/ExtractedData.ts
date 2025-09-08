import mongoose, { Document, Schema } from 'mongoose';

export interface IExtractedData extends Document {
  title: string;
  summary: string;
  keyPoints: string[];
  date: Date;
  author: string;
  originalText: string;
  metadata: {
    model?: string;
    timestamp?: string;
    charactersProcessed?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const extractedDataSchema = new Schema<IExtractedData>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    keyPoints: [
      {
        type: String,
        trim: true,
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: String,
      default: 'Unknown',
      trim: true,
    },
    originalText: {
      type: String,
      required: true,
    },
    metadata: {
      model: {
        type: String,
        trim: true,
      },
      timestamp: {
        type: String,
      },
      charactersProcessed: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret._id;
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret._id;
      },
    },
  }
);

// Create text index for search functionality
extractedDataSchema.index({
  title: 'text',
  summary: 'text',
  originalText: 'text',
});

const ExtractedData = mongoose.model<IExtractedData>('ExtractedData', extractedDataSchema);

export default ExtractedData;
