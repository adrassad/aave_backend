import { NotificationGateway } from "../integrations/private/notification-gateway.js";

export const NotificationService = {
  async sendToUser(userId, message, options = {}) {
    return NotificationGateway.sendToUser(userId, message, options);
  },
};
