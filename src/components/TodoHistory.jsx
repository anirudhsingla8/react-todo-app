import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme
} from '@mui/material';
import {
  AddCircle as AddIcon,
  CheckCircle as CheckIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Notes as NotesIcon
} from '@mui/icons-material';

const TodoHistory = ({ todos }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();

  // Simulate fetching history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, this would fetch from an API endpoint
        // For now, we'll simulate with local storage or generate mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock history data based on todos
        const mockHistory = [];
        const now = new Date();
        
        todos.forEach(todo => {
          // Add creation event
          mockHistory.push({
            id: `${todo.id}-created`,
            todoId: todo.id,
            action: 'created',
            timestamp: new Date(todo.createdAt),
            details: `Created todo: "${todo.text.substring(0, 50)}${todo.text.length > 50 ? '...' : ''}"`
          });
          
          // Add completion events if todo was completed
          if (todo.completed && todo.completedAt) {
            mockHistory.push({
              id: `${todo.id}-completed`,
              todoId: todo.id,
              action: 'completed',
              timestamp: new Date(todo.completedAt),
              details: `Marked todo as completed: "${todo.text.substring(0, 50)}${todo.text.length > 50 ? '...' : ''}"`
            });
          }
          
          // Add update events if todo has notes or tags
          if (todo.notes || (todo.tags && todo.tags.length > 0)) {
            mockHistory.push({
              id: `${todo.id}-updated`,
              todoId: todo.id,
              action: 'updated',
              timestamp: new Date(todo.updatedAt || todo.createdAt),
              details: `Updated todo details: "${todo.text.substring(0, 50)}${todo.text.length > 50 ? '...' : ''}`
            });
          }
        });
        
        // Sort by timestamp descending
        mockHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setHistory(mockHistory);
      } catch (err) {
        setError('Failed to load history. Please try again.');
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (todos.length > 0) {
      fetchHistory();
    }
  }, [todos]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'created':
        return <AddIcon sx={{ color: theme.palette.primary.main }} />;
      case 'completed':
        return <CheckIcon sx={{ color: theme.palette.success.main }} />;
      case 'updated':
        return <EditIcon sx={{ color: theme.palette.warning.main }} />;
      case 'deleted':
        return <DeleteIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return <NotesIcon sx={{ color: theme.palette.info.main }} />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'created':
        return theme.palette.primary.main;
      case 'completed':
        return theme.palette.success.main;
      case 'updated':
        return theme.palette.warning.main;
      case 'deleted':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  if (loading) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            History
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading history...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            History
          </Typography>
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          History
        </Typography>
        
        {history.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }} aria-hidden="true">
              📜
            </Typography>
            <Typography variant="h6" color="text.secondary">
              No history available yet.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Complete some todos to see history
            </Typography>
          </Box>
        ) : (
          <List sx={{ 
            maxHeight: 400, 
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': {
              width: 8,
            },
            '&::-webkit-scrollbar-track': {
              background: theme.palette.grey[100],
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              background: theme.palette.grey[400],
              borderRadius: 4,
            }
          }}>
            {history.map((item) => (
              <ListItem 
                key={item.id} 
                sx={{ 
                  mb: 1, 
                  borderRadius: 2,
                  borderLeft: 4,
                  borderLeftColor: getActionColor(item.action),
                  backgroundColor: theme.palette.background.default,
                  '&:hover': {
                    backgroundColor: theme.palette.grey[50],
                  }
                }}
                disablePadding
              >
                <ListItemIcon sx={{ minWidth: 40, color: getActionColor(item.action) }}>
                  {getActionIcon(item.action)}
                </ListItemIcon>
                <ListItemText 
                  primary={item.details} 
                  secondary={formatTimestamp(item.timestamp)}
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    sx: { 
                      wordBreak: 'break-word',
                      mb: 0.5
                    } 
                  }}
                  secondaryTypographyProps={{ 
                    variant: 'caption',
                    color: 'text.secondary'
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoHistory;