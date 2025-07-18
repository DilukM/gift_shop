import Joi from "joi";

// Generic validation middleware factory
export const validateRequest = (validationType) => {
  return (req, res, next) => {
    let schema;

    switch (validationType) {
      case "createOrder":
        return validateOrderData(req, res, next);
      case "calculateOrderTotals":
        schema = Joi.object({
          items: Joi.array()
            .items(
              Joi.object({
                productId: Joi.string().uuid().required(),
                quantity: Joi.number().integer().min(1).required(),
              })
            )
            .min(1)
            .required(),
        });
        break;
      case "orderId":
        schema = Joi.object({
          id: Joi.string().uuid().required(),
        });
        break;
      case "getOrders":
        schema = Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(10),
          status: Joi.string()
            .valid("pending", "processing", "shipped", "delivered", "cancelled")
            .optional(),
          userId: Joi.string().uuid().optional(),
        });
        break;
      case "updateOrderStatus":
        schema = Joi.object({
          status: Joi.string()
            .valid("pending", "processing", "shipped", "delivered", "cancelled")
            .required(),
        });
        break;
      case "cancelOrder":
        schema = Joi.object({
          reason: Joi.string().min(3).max(500).optional(),
        });
        break;
      case "processPayment":
        schema = Joi.object({
          paymentMethod: Joi.string()
            .valid("card", "paypal", "bank_transfer")
            .required(),
          paymentDetails: Joi.object().required(),
        });
        break;
      case "createContactMessage":
        return validateContactMessage(req, res, next);
      case "getContactMessages":
        schema = Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(10),
          status: Joi.string().valid("unread", "read", "replied").optional(),
        });
        break;
      case "contactMessageId":
        schema = Joi.object({
          id: Joi.string().uuid().required(),
        });
        break;
      case "updateContactMessageStatus":
        schema = Joi.object({
          status: Joi.string().valid("unread", "read", "replied").required(),
        });
        break;
      case "replyToContactMessage":
        schema = Joi.object({
          reply: Joi.string().min(10).max(2000).required(),
          replyEmail: Joi.string().email().optional(),
        });
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Unknown validation type",
        });
    }

    const validationTarget = ["GET", "DELETE"].includes(req.method)
      ? req.params
      : req.body;
    const { error, value } = schema.validate(validationTarget);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    if (["GET", "DELETE"].includes(req.method)) {
      req.params = value;
    } else {
      req.body = value;
    }

    next();
  };
};

// Product query validation
export const validateProductQuery = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(12),
    category: Joi.string().uuid().optional(),
    search: Joi.string().min(1).max(100).optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    sortBy: Joi.string()
      .valid(
        "created_at",
        "price_asc",
        "price_desc",
        "name",
        "rating",
        "popular",
        "featured"
      )
      .default("created_at"),
    inStock: Joi.string().valid("true", "false").optional(),
    featured: Joi.string().valid("true", "false").optional(),
    popular: Joi.string().valid("true", "false").optional(),
  });

  const { error, value } = schema.validate(req.query);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
  }

  req.query = value;
  next();
};

// Product ID validation
export const validateProductId = (req, res, next) => {
  const { id } = req.params;

  // Check if it's a valid UUID or slug
  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id
    );
  const isSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);

  if (!isUUID && !isSlug) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID or slug format",
    });
  }

  next();
};

// Cart item validation
export const validateCartItem = (req, res, next) => {
  const schema = Joi.object({
    productId: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).max(100).default(1),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
  }

  req.body = value;
  next();
};

// Product data validation (for admin endpoints)
export const validateProductData = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    slug: Joi.string().min(1).max(255).optional(),
    description: Joi.string().max(2000).optional(),
    categoryId: Joi.string().uuid().required(),
    price: Joi.number().min(0).required(),
    originalPrice: Joi.number().min(0).optional(),
    sku: Joi.string().max(100).optional(),
    stockCount: Joi.number().integer().min(0).default(0),
    isActive: Joi.boolean().default(true),
    isFeatured: Joi.boolean().default(false),
    isPopular: Joi.boolean().default(false),
    weight: Joi.number().min(0).optional(),
    dimensions: Joi.object().optional(),
    images: Joi.array().items(Joi.string().uri()).default([]),
    features: Joi.array().items(Joi.string()).default([]),
    tags: Joi.array().items(Joi.string()).default([]),
    metaTitle: Joi.string().max(255).optional(),
    metaDescription: Joi.string().max(500).optional(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
  }

  req.body = value;
  next();
};

// Order validation
export const validateOrderData = (req, res, next) => {
  const schema = Joi.object({
    customerInfo: Joi.object({
      firstName: Joi.string().min(1).max(100).required(),
      lastName: Joi.string().min(1).max(100).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(10).max(20).required(),
    }).required(),
    shippingAddress: Joi.object({
      street: Joi.string().min(1).max(255).required(),
      city: Joi.string().min(1).max(100).required(),
      state: Joi.string().min(1).max(100).required(),
      zipCode: Joi.string().min(5).max(10).required(),
      country: Joi.string().min(2).max(100).default("US"),
    }).required(),
    billingAddress: Joi.object({
      street: Joi.string().min(1).max(255).required(),
      city: Joi.string().min(1).max(100).required(),
      state: Joi.string().min(1).max(100).required(),
      zipCode: Joi.string().min(5).max(10).required(),
      country: Joi.string().min(2).max(100).default("US"),
    }).optional(),
    paymentMethod: Joi.string()
      .valid("credit_card", "paypal", "stripe")
      .required(),
    notes: Joi.string().max(500).optional(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
  }

  req.body = value;
  next();
};

// Contact form validation
export const validateContactMessage = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(20).optional(),
    subject: Joi.string().min(1).max(255).optional(),
    message: Joi.string().min(1).max(2000).required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
  }

  req.body = value;
  next();
};
