import mongoose from "mongoose";

const AllianceMemberSchema = new mongoose.Schema(
  {
    tag: { type: String, required: true }, // Định danh clan bằng tag
    joinedAt: { type: Date, default: Date.now }, // Ngày gia nhập liên minh
  },
  { _id: false }
);

const AllianceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Tên liên minh
    adminClan: { type: String, required: true }, // Tag clan quản trị
    members: {
      type: [AllianceMemberSchema],
      validate: {
        validator: function (v) {
          return v.length <= 5; // Giới hạn tối đa 5 clan
        },
        message: "Một liên minh không được có nhiều hơn 5 clan.",
      },
    },
    settings: {
      resetDay: { type: Number, default: 1 }, // Ngày reset hàng tháng (1-31)
      dailySupportAvg: { type: Number, default: 150 }, // Mức hỗ trợ trung bình hàng ngày
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Alliance = mongoose.model("Alliance", AllianceSchema);

export default Alliance;
