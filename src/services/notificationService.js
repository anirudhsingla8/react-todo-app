// Notification Service for handling all user-facing messages
class NotificationService {
  constructor() {
    this.notifications = [];
    this.listeners = [];
  }

  // Subscribe to notifications
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all subscribers
  notify(notification) {
    this.listeners.forEach(callback => callback(notification));
  }

  // Add a new notification
  addNotification(type, message, duration = 5000) {
    // Generate a more reliable unique ID
    const id = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    const notification = {
      id,
      type,
      message,
      timestamp: new Date()
    };

    this.notifications.push(notification);
    this.notify(notification);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(id);
      }, duration);
    }

    return id;
  }

  // Remove a notification by ID
  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    // Notify with a special removal notification instead of null
    this.notify({ id, type: 'remove' });
  }

  // Success message
  success(message, duration) {
    return this.addNotification('success', message, duration);
  }

  // Error message
  error(message, duration) {
    return this.addNotification('error', message, duration);
  }

  // Warning message
  warning(message, duration) {
    return this.addNotification('warning', message, duration);
  }

  // Info message
  info(message, duration) {
    return this.addNotification('info', message, duration);
  }

  // Validation error message
  validationError(field, message, duration) {
    return this.addNotification('validation', `${field}: ${message}`, duration);
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.notify({ type: 'clearAll' });
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService;