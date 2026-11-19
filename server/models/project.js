import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  originalImage: {
    type: String,
    required: true
  },
  paintedImage: {  // <-- ADD THIS
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);