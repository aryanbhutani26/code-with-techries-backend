const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide job title"],
  },
  description: {
    type: String,
    required: [true, "Please provide job description"],
  },
  location: {
    type: String,
    required: [true, "Please provide job location"],
  },
  jobType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract'],
    required: [true, "Please specify job type"],
  },
  skillsRequired: {
    type: [String],
    required: [true, "Please mention skills required"],
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
