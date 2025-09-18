const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "items.productType",
        },
        productType: {
          type: String,
          required: true,
          enum: ["FreshFruit", "GreenVegetable", "FreshTea", "FreshDreadJuice", "FreshBread"],
        },
        name: { type: String, required: true },
        img: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        deliveryMethod: { 
          type: String, 
          enum: ["delivery", "pickup"], 
          required: true 
        },
        // Note: No deliveryLocation at item level - it's at order level
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    deliveryLocation: { 
      type: String, 
      // Required only if any item has delivery method
      required: function() {
        return this.items.some(item => item.deliveryMethod === "delivery");
      } 
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual to check if order has delivery items
orderSchema.virtual('hasDeliveryItems').get(function() {
  return this.items.some(item => item.deliveryMethod === "delivery");
});

// Pre-save middleware to validate delivery location
orderSchema.pre('save', function(next) {
  const hasDeliveryItems = this.items.some(item => item.deliveryMethod === "delivery");
  
  if (hasDeliveryItems && (!this.deliveryLocation || this.deliveryLocation.trim() === "")) {
    const error = new Error("Delivery location is required for delivery items");
    return next(error);
  }
  
  // Clear delivery location if no delivery items
  if (!hasDeliveryItems) {
    this.deliveryLocation = undefined;
  }
  
  next();
});

module.exports = mongoose.model("Order", orderSchema);