export class OrderItem {
  constructor({
    id,
    orderId,
    productId,
    productName,
    productSku,
    quantity,
    unitPrice,
    totalPrice,
    productData,
    createdAt,
  }) {
    this.id = id;
    this.orderId = orderId;
    this.productId = productId;
    this.productName = productName;
    this.productSku = productSku;
    this.quantity = parseInt(quantity);
    this.unitPrice = parseFloat(unitPrice);
    this.totalPrice = parseFloat(totalPrice);
    this.productData = productData;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      orderId: this.orderId,
      productId: this.productId,
      productName: this.productName,
      productSku: this.productSku,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
      totalPrice: this.totalPrice,
      productData: this.productData,
      createdAt: this.createdAt,
    };
  }

  static fromDatabase(row) {
    return new OrderItem({
      id: row.id,
      orderId: row.order_id,
      productId: row.product_id,
      productName: row.product_name,
      productSku: row.product_sku,
      quantity: row.quantity,
      unitPrice: row.unit_price,
      totalPrice: row.total_price,
      productData: row.product_data,
      createdAt: row.created_at,
    });
  }
}

export class Order {
  constructor({
    id,
    orderNumber,
    userId,
    status = "pending",
    totalAmount,
    subtotal,
    taxAmount = 0,
    shippingAmount = 0,
    discountAmount = 0,
    currency = "USD",
    paymentStatus = "pending",
    paymentMethod,
    shippingAddress,
    billingAddress,
    customerInfo,
    notes,
    estimatedDeliveryDate,
    trackingNumber,
    items = [],
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.orderNumber = orderNumber;
    this.userId = userId;
    this.status = status;
    this.totalAmount = parseFloat(totalAmount);
    this.subtotal = parseFloat(subtotal);
    this.taxAmount = parseFloat(taxAmount);
    this.shippingAmount = parseFloat(shippingAmount);
    this.discountAmount = parseFloat(discountAmount);
    this.currency = currency;
    this.paymentStatus = paymentStatus;
    this.paymentMethod = paymentMethod;
    this.shippingAddress = shippingAddress;
    this.billingAddress = billingAddress;
    this.customerInfo = customerInfo;
    this.notes = notes;
    this.estimatedDeliveryDate = estimatedDeliveryDate;
    this.trackingNumber = trackingNumber;
    this.items = items.map((item) =>
      item instanceof OrderItem ? item : new OrderItem(item)
    );
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Business methods
  canCancel() {
    return ["pending", "confirmed"].includes(this.status);
  }

  canRefund() {
    return (
      ["completed", "delivered"].includes(this.status) &&
      this.paymentStatus === "paid"
    );
  }

  updateStatus(newStatus) {
    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];

    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    this.status = newStatus;
  }

  updatePaymentStatus(newStatus) {
    const validStatuses = ["pending", "paid", "failed", "refunded"];

    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid payment status: ${newStatus}`);
    }

    this.paymentStatus = newStatus;
  }

  addTrackingNumber(trackingNumber) {
    this.trackingNumber = trackingNumber;
    if (this.status === "processing") {
      this.updateStatus("shipped");
    }
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  calculateEstimatedDelivery(businessDays = 3) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + businessDays);
    return deliveryDate;
  }

  generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `GB-${timestamp}-${random}`;
  }

  toJSON() {
    return {
      id: this.id,
      orderNumber: this.orderNumber,
      userId: this.userId,
      status: this.status,
      totalAmount: this.totalAmount,
      subtotal: this.subtotal,
      taxAmount: this.taxAmount,
      shippingAmount: this.shippingAmount,
      discountAmount: this.discountAmount,
      currency: this.currency,
      paymentStatus: this.paymentStatus,
      paymentMethod: this.paymentMethod,
      shippingAddress: this.shippingAddress,
      billingAddress: this.billingAddress,
      customerInfo: this.customerInfo,
      notes: this.notes,
      estimatedDeliveryDate: this.estimatedDeliveryDate,
      trackingNumber: this.trackingNumber,
      items: this.items.map((item) => item.toJSON()),
      totalItems: this.getTotalItems(),
      canCancel: this.canCancel(),
      canRefund: this.canRefund(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromDatabase(row, items = []) {
    return new Order({
      id: row.id,
      orderNumber: row.order_number,
      userId: row.user_id,
      status: row.status,
      totalAmount: row.total_amount,
      subtotal: row.subtotal,
      taxAmount: row.tax_amount,
      shippingAmount: row.shipping_amount,
      discountAmount: row.discount_amount,
      currency: row.currency,
      paymentStatus: row.payment_status,
      paymentMethod: row.payment_method,
      shippingAddress: row.shipping_address,
      billingAddress: row.billing_address,
      customerInfo: row.customer_info,
      notes: row.notes,
      estimatedDeliveryDate: row.estimated_delivery_date,
      trackingNumber: row.tracking_number,
      items: items,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  static fromCart(cart, customerInfo, paymentMethod = null) {
    const summary = cart.getSummary();
    const orderNumber = new Order({}).generateOrderNumber();

    return new Order({
      orderNumber,
      userId: cart.userId,
      totalAmount: summary.total,
      subtotal: summary.subtotal,
      taxAmount: summary.tax,
      shippingAmount: summary.shipping,
      paymentMethod,
      customerInfo,
      estimatedDeliveryDate: new Order({}).calculateEstimatedDelivery(),
      items: cart.items.map((cartItem) => ({
        productId: cartItem.productId,
        productName: cartItem.product.name,
        productSku: cartItem.product.sku,
        quantity: cartItem.quantity,
        unitPrice: cartItem.price,
        totalPrice: cartItem.getTotalPrice(),
        productData: cartItem.product.toJSON(),
      })),
    });
  }
}
