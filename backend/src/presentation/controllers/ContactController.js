import { ContactService } from "../../application/services/ContactService.js";

export class ContactController {
  constructor() {
    this.contactService = new ContactService();
  }

  // Submit contact message
  submitContactMessage = async (req, res, next) => {
    try {
      const messageData = req.body;
      const message = await this.contactService.submitContactMessage(
        messageData
      );

      res.status(201).json({
        success: true,
        message: "Contact message submitted successfully",
        data: message,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get all contact messages (admin)
  getContactMessages = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, status, type } = req.query;
      const { messages, pagination } =
        await this.contactService.getContactMessages({
          page: parseInt(page),
          limit: parseInt(limit),
          status,
          type,
        });

      res.json({
        success: true,
        data: messages,
        pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get contact message by ID
  getContactMessageById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const message = await this.contactService.getContactMessageById(id);

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Contact message not found",
        });
      }

      res.json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update message status
  updateMessageStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const message = await this.contactService.updateMessageStatus(
        id,
        status,
        notes
      );

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Contact message not found",
        });
      }

      res.json({
        success: true,
        message: "Message status updated successfully",
        data: message,
      });
    } catch (error) {
      next(error);
    }
  };

  // Reply to contact message
  replyToMessage = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reply, replyMethod } = req.body;

      const result = await this.contactService.replyToMessage(
        id,
        reply,
        replyMethod
      );

      res.json({
        success: true,
        message: "Reply sent successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete contact message
  deleteContactMessage = async (req, res, next) => {
    try {
      const { id } = req.params;

      const deleted = await this.contactService.deleteContactMessage(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Contact message not found",
        });
      }

      res.json({
        success: true,
        message: "Contact message deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  // Get contact statistics (admin)
  getContactStatistics = async (req, res, next) => {
    try {
      const { period = "30d" } = req.query;
      const statistics = await this.contactService.getContactStatistics(period);

      res.json({
        success: true,
        data: statistics,
      });
    } catch (error) {
      next(error);
    }
  };
}
