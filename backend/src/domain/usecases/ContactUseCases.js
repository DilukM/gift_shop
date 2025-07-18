import { ContactMessage } from "../entities/ContactMessage.js";
import { v4 as uuidv4 } from "uuid";

export class ContactUseCases {
  constructor(contactRepository) {
    this.contactRepository = contactRepository;
  }

  async submitContactMessage(messageData) {
    // Validate required fields
    if (!messageData.name || !messageData.email || !messageData.message) {
      throw new Error("Name, email, and message are required");
    }

    // Create contact message entity
    const contactMessage = new ContactMessage({
      id: uuidv4(),
      name: messageData.name,
      email: messageData.email,
      phone: messageData.phone,
      subject: messageData.subject,
      message: messageData.message,
      type: messageData.type || "general",
      status: "new",
    });

    // Validate the entity
    contactMessage.validate();

    // Save to repository
    return await this.contactRepository.create(contactMessage);
  }

  async getContactMessageById(id) {
    if (!id) {
      throw new Error("Contact message ID is required");
    }

    return await this.contactRepository.findById(id);
  }

  async getAllContactMessages(filters = {}) {
    return await this.contactRepository.findAll(filters);
  }

  async updateContactMessageStatus(id, status, adminNotes) {
    if (!id || !status) {
      throw new Error("Contact message ID and status are required");
    }

    const validStatuses = ["new", "read", "in_progress", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    const updateData = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    return await this.contactRepository.update(id, updateData);
  }

  async replyToContactMessage(id, reply) {
    if (!id || !reply) {
      throw new Error("Contact message ID and reply are required");
    }

    const updateData = {
      reply,
      repliedAt: new Date(),
      status: "resolved",
    };

    return await this.contactRepository.update(id, updateData);
  }

  async deleteContactMessage(id) {
    if (!id) {
      throw new Error("Contact message ID is required");
    }

    return await this.contactRepository.delete(id);
  }

  async markAsRead(id) {
    if (!id) {
      throw new Error("Contact message ID is required");
    }

    return await this.contactRepository.markAsRead(id);
  }

  async getContactStatistics(period = "30d") {
    return await this.contactRepository.getContactStatistics(period);
  }

  async searchContactMessages(query, filters = {}) {
    if (!query) {
      return await this.getAllContactMessages(filters);
    }

    // This would typically use a full-text search in the database
    // For now, we'll implement basic filtering
    const allMessages = await this.contactRepository.findAll(filters);

    const searchTerm = query.toLowerCase();
    return allMessages.filter(
      (message) =>
        message.name.toLowerCase().includes(searchTerm) ||
        message.email.toLowerCase().includes(searchTerm) ||
        message.message.toLowerCase().includes(searchTerm) ||
        (message.subject && message.subject.toLowerCase().includes(searchTerm))
    );
  }

  async getMessagesByType(type, filters = {}) {
    const validTypes = [
      "general",
      "support",
      "complaint",
      "suggestion",
      "other",
    ];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid type. Must be one of: ${validTypes.join(", ")}`);
    }

    return await this.contactRepository.findAll({ ...filters, type });
  }

  async getUnreadMessages(filters = {}) {
    return await this.contactRepository.findAll({ ...filters, status: "new" });
  }

  async bulkUpdateStatus(messageIds, status) {
    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      throw new Error("Message IDs array is required");
    }

    const validStatuses = ["new", "read", "in_progress", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    const results = [];
    for (const id of messageIds) {
      try {
        const updated = await this.contactRepository.update(id, { status });
        results.push({ id, success: true, message: updated });
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }

    return results;
  }
}
