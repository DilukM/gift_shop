export class User {
  constructor({
    id,
    email,
    firstName,
    lastName,
    phone,
    isAdmin = false,
    isActive = true,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.isAdmin = isAdmin;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.getFullName(),
      phone: this.phone,
      isAdmin: this.isAdmin,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromDatabase(row) {
    return new User({
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      isAdmin: row.is_admin,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}

export class Category {
  constructor({
    id,
    name,
    slug,
    description,
    imageUrl,
    isActive = true,
    sortOrder = 0,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.description = description;
    this.imageUrl = imageUrl;
    this.isActive = isActive;
    this.sortOrder = sortOrder;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      imageUrl: this.imageUrl,
      isActive: this.isActive,
      sortOrder: this.sortOrder,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromDatabase(row) {
    return new Category({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      imageUrl: row.image_url,
      isActive: row.is_active,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}

export class ContactMessage {
  constructor({
    id,
    name,
    email,
    phone,
    subject,
    message,
    status = "new",
    respondedAt,
    responseMessage,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.subject = subject;
    this.message = message;
    this.status = status;
    this.respondedAt = respondedAt;
    this.responseMessage = responseMessage;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  markAsRead() {
    if (this.status === "new") {
      this.status = "read";
    }
  }

  respond(responseMessage) {
    this.responseMessage = responseMessage;
    this.respondedAt = new Date();
    this.status = "responded";
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      subject: this.subject,
      message: this.message,
      status: this.status,
      respondedAt: this.respondedAt,
      responseMessage: this.responseMessage,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromDatabase(row) {
    return new ContactMessage({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      subject: row.subject,
      message: row.message,
      status: row.status,
      respondedAt: row.responded_at,
      responseMessage: row.response_message,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
