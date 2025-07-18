import express from "express";
import { ContactController } from "../controllers/ContactController.js";
import { validateRequest } from "../middleware/validation.js";

const router = express.Router();
const contactController = new ContactController();

// Public routes
router.post(
  "/",
  validateRequest("createContactMessage"),
  contactController.submitContactMessage
);

// Protected routes (would require authentication middleware)
router.get(
  "/",
  validateRequest("getContactMessages"),
  contactController.getContactMessages
);
router.get("/statistics", contactController.getContactStatistics);
router.get(
  "/:id",
  validateRequest("contactMessageId"),
  contactController.getContactMessageById
);
router.patch(
  "/:id/status",
  validateRequest("updateContactMessageStatus"),
  contactController.updateMessageStatus
);
router.patch(
  "/:id/reply",
  validateRequest("replyToContactMessage"),
  contactController.replyToMessage
);
router.delete(
  "/:id",
  validateRequest("contactMessageId"),
  contactController.deleteContactMessage
);

export default router;
