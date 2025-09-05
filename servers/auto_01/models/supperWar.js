import mongoose from "mongoose";

const ourClanSchema = new mongoose.Schema({});

const roundSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
  },
  teamSize: {
    type: Number,
    required: true,
  },
  preparationStartTime: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});
