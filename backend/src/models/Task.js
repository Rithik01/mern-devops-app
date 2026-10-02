import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 1000,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  // timestamps: true adds createdAt and updatedAt automatically
  { timestamps: true },
);

export default mongoose.model('Task', taskSchema);
