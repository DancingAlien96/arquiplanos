import mongoose, { Schema, model, models } from "mongoose";

export interface IOrder {
  _id?: string;
  checkoutId: string;
  projectId: mongoose.Types.ObjectId | string;
  buyerEmail?: string;
  status: "pending" | "paid" | "failed";
  createdAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    checkoutId: { type: String, required: true, unique: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    buyerEmail: { type: String, default: "" },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  },
  { timestamps: true }
);

const Order = models.Order ?? model<IOrder>("Order", OrderSchema);

export default Order;
