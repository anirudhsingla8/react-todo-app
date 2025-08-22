import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, Slide } from '@mui/material';
import notificationService from '../services/notificationService';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notification) => {
      if (notification && notification.type === 'remove') {
        // Remove specific notification
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      } else if (notification && notification.type === 'clearAll') {
        // Clear all notifications
        setNotifications([]);
      } else if (notification) {
        // Add new notification
        setNotifications(prev => [...prev, notification]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleClose = (id) => {
    // Remove notification immediately
    setNotifications(prev => prev.filter(n => n.id !== id));
    // Notify service to clean up
    notificationService.removeNotification(id);
  };

  // Custom transition component for smoother animations
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });

  return (
    <div role="region" aria-label="Notifications" tabIndex={-1}>
      {notifications.map(notification => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.type === 'error' ? 6000 : 3000}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          role="alert"
          aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
          TransitionComponent={Transition}
          sx={{
            mt: 1,
            '& .MuiSnackbarContent-root': {
              minWidth: 280,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }
          }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{
              width: '100%',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              '& .MuiAlert-message': {
                fontWeight: 500,
              }
            }}
            role="alert"
            elevation={0}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
};

export default Notification;