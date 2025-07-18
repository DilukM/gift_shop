import { ContactUseCases } from "../../domain/usecases/ContactUseCases.js";
import { PostgresContactRepository } from "../../infrastructure/repositories/PostgresContactRepository.js";

export class ContactService {
  constructor() {
    this.contactRepository = new PostgresContactRepository();
    this.contactUseCases = new ContactUseCases(this.contactRepository);
  }

  async submitContactMessage(messageData) {
    return await this.contactUseCases.submitContactMessage(messageData);
  }

  async getContactMessageById(id) {
    return await this.contactRepository.findById(id);
  }

  async getContactMessages({
    page = 1,
    limit = 10,
    status,
    type,
    startDate,
    endDate,
  } = {}) {
    const messages = await this.contactRepository.findAll({
      page,
      limit,
      status,
      type,
      startDate,
      endDate,
    });

    // Calculate pagination info
    const totalQuery = await this.contactRepository.findAll({
      status,
      type,
      startDate,
      endDate,
    });
    const total = totalQuery.length;
    const totalPages = Math.ceil(total / limit);

    return {
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async updateMessageStatus(id, status, notes) {
    const updateData = { status };
    if (notes) {
      updateData.adminNotes = notes;
    }

    return await this.contactRepository.update(id, updateData);
  }

  async replyToMessage(id, reply, replyMethod = "email") {
    const updateData = {
      reply,
      repliedAt: new Date(),
      status: "resolved",
    };

    const message = await this.contactRepository.update(id, updateData);

    if (message && replyMethod === "email") {
      // Here you would integrate with an email service
      await this._sendEmailReply(message, reply);
    }

    return message;
  }

  async deleteContactMessage(id) {
    return await this.contactRepository.delete(id);
  }

  async getContactStatistics(period = "30d") {
    return await this.contactRepository.getContactStatistics(period);
  }

  async markAsRead(id) {
    return await this.contactRepository.markAsRead(id);
  }

  async getMessagesByType(type, { page = 1, limit = 10 } = {}) {
    return await this.getContactMessages({ page, limit, type });
  }

  async getUnreadMessages({ page = 1, limit = 10 } = {}) {
    return await this.getContactMessages({ page, limit, status: "new" });
  }

  async bulkUpdateStatus(messageIds, status) {
    const results = [];

    for (const id of messageIds) {
      try {
        const updated = await this.updateMessageStatus(id, status);
        results.push({ id, success: true, message: updated });
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }

    return results;
  }

  async searchMessages(query, { page = 1, limit = 10 } = {}) {
    // This would be implemented with full-text search in PostgreSQL
    // For now, we'll do a simple search across name, email, and message content
    const messages = await this.contactRepository.findAll();

    const filtered = messages.filter(
      (message) =>
        message.name.toLowerCase().includes(query.toLowerCase()) ||
        message.email.toLowerCase().includes(query.toLowerCase()) ||
        message.message.toLowerCase().includes(query.toLowerCase())
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filtered.slice(startIndex, endIndex);

    return {
      messages: paginatedResults,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
        hasNext: endIndex < filtered.length,
        hasPrev: page > 1,
      },
    };
  }

  async _sendEmailReply(message, reply) {
    // This would integrate with an email service like SendGrid, Mailgun, etc.
    console.log(`Sending email reply to ${message.email}:`, reply);

    // Example integration:
    // await emailService.send({
    //   to: message.email,
    //   subject: `Re: Your message to GiftBloom`,
    //   html: `
    //     <p>Dear ${message.name},</p>
    //     <p>Thank you for contacting GiftBloom. Here's our response to your message:</p>
    //     <blockquote style="border-left: 3px solid #ccc; padding-left: 15px; margin: 15px 0;">
    //       ${message.message}
    //     </blockquote>
    //     <p>${reply}</p>
    //     <p>Best regards,<br>GiftBloom Customer Service Team</p>
    //   `
    // });

    return true;
  }

  async getResponseTimeAnalytics(period = "30d") {
    const messages = await this.contactRepository.findAll({
      startDate: new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000),
    });

    const resolvedMessages = messages.filter(
      (m) => m.status === "resolved" && m.repliedAt
    );

    if (resolvedMessages.length === 0) {
      return {
        averageResponseTime: 0,
        totalResolved: 0,
        fastestResponse: 0,
        slowestResponse: 0,
      };
    }

    const responseTimes = resolvedMessages.map(
      (m) => new Date(m.repliedAt) - new Date(m.createdAt)
    );

    return {
      averageResponseTime:
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      totalResolved: resolvedMessages.length,
      fastestResponse: Math.min(...responseTimes),
      slowestResponse: Math.max(...responseTimes),
    };
  }
}
