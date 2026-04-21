import mongoose, { Schema, Document, models } from "mongoose";

// ... keep your existing ILead interface here ...

const HistorySchema = new Schema({
  action: { type: String, required: true },
  details: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const LeadSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    budget: { type: Number, required: true },
    location: { type: String, required: true },
    propertyType: { 
      type: String, 
      required: true,
      enum: ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Plot", "Commercial"] 
    },
    source: { 
      type: String, 
      required: true,
      enum: ["Facebook", "Google", "Referral", "Website", "Other"]
    },
    status: { 
      type: String, 
      default: "New",
      enum: ["New", "Contacted", "Site Visit", "Closed", "Lost"]
    },
    notes: [{ type: String }],
    history: [HistorySchema], // Added the history array
  },
  { timestamps: true }
);

const Lead = models.Lead || mongoose.model("Lead", LeadSchema);
export default Lead;