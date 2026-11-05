const mongoose = require("mongoose");

const { Types } = mongoose.Schema;

const LogSchema = new mongoose.Schema(
  {
    user: { type: Types.ObjectId},
    data: { type: Object },
    url: String,
    response: Object,
    endpointName: String,
    endpointDescription: String,
    userType: {
      type: String, 
      default: 'User',
      enum: ['User', 'Admin']
    },
    success: {type: Boolean, default: true},
    apiChannel: {type: Boolean, default: false},
  },
  { timestamps: true }
);

LogSchema.index({user: 1});

const Log = mongoose.model("Log", LogSchema);
export default Log;
