export class ContactMessage {
  constructor({
    id,
    name,
    email,
    phone,
    subject,
    message,
    type = "general",
    status = "new",
    priority = "normal",
    adminNotes,
    reply,
    repliedAt,
    repliedBy,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.subject = subject;
    this.message = message;
    this.type = type;
    this.status = status;
    this.priority = priority;
    this.adminNotes = adminNotes;
    this.reply = reply;
    this.repliedAt = repliedAt;
    this.repliedBy = repliedBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  validate() {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Name is required");
    }

    if (!this.email || this.email.trim().length === 0) {
      throw new Error("Email is required");
    }

    if (!this.isValidEmail(this.email)) {
      throw new Error("Invalid email format");
    }

    if (!this.message || this.message.trim().length === 0) {
      throw new Error("Message is required");
    }

    if (this.message.length > 5000) {
      throw new Error("Message cannot exceed 5000 characters");
    }

    if (this.name.length > 200) {
      throw new Error("Name cannot exceed 200 characters");
    }

    if (this.email.length > 255) {
      throw new Error("Email cannot exceed 255 characters");
    }

    if (this.phone && this.phone.length > 20) {
      throw new Error("Phone number cannot exceed 20 characters");
    }

    if (this.subject && this.subject.length > 300) {
      throw new Error("Subject cannot exceed 300 characters");
    }

    const validTypes = [
      "general",
      "support",
      "complaint",
      "suggestion",
      "other",
    ];
    if (!validTypes.includes(this.type)) {
      throw new Error(`Invalid type. Must be one of: ${validTypes.join(", ")}`);
    }

    const validStatuses = ["new", "read", "in_progress", "resolved", "closed"];
    if (!validStatuses.includes(this.status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    const validPriorities = ["low", "normal", "high", "urgent"];
    if (!validPriorities.includes(this.priority)) {
      throw new Error(
        `Invalid priority. Must be one of: ${validPriorities.join(", ")}`
      );
    }

    return true;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  markAsRead() {
    if (this.status === "new") {
      this.status = "read";
      this.updatedAt = new Date();
    }
  }

  markAsInProgress() {
    this.status = "in_progress";
    this.updatedAt = new Date();
  }

  markAsResolved(reply, repliedBy) {
    this.status = "resolved";
    this.reply = reply;
    this.repliedAt = new Date();
    this.repliedBy = repliedBy;
    this.updatedAt = new Date();
  }

  markAsClosed() {
    this.status = "closed";
    this.updatedAt = new Date();
  }

  addAdminNotes(notes) {
    this.adminNotes = notes;
    this.updatedAt = new Date();
  }

  getTimeSinceCreated() {
    const now = new Date();
    const diffInMs = now - this.createdAt;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }
  }

  getResponseTime() {
    if (!this.repliedAt) {
      return null;
    }

    const diffInMs = this.repliedAt - this.createdAt;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""}`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""}`;
    } else {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
    }
  }

  isOverdue(hoursThreshold = 24) {
    if (this.status === "resolved" || this.status === "closed") {
      return false;
    }

    const now = new Date();
    const diffInMs = now - this.createdAt;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    return diffInHours > hoursThreshold;
  }

  isPriority() {
    return this.priority === "high" || this.priority === "urgent";
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      subject: this.subject,
      message: this.message,
      type: this.type,
      status: this.status,
      priority: this.priority,
      adminNotes: this.adminNotes,
      reply: this.reply,
      repliedAt: this.repliedAt,
      repliedBy: this.repliedBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      timeSinceCreated: this.getTimeSinceCreated(),
      responseTime: this.getResponseTime(),
      isOverdue: this.isOverdue(),
      isPriority: this.isPriority(),
    };
  }
}
