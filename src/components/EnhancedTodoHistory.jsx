import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme
} from '@mui/material';
import {
  AddCircle as AddIcon,
  CheckCircle as CheckIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const EnhancedTodoHistory = ({ todos }) => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const theme = useTheme();

  // Generate history from todos
  useEffect(() => {
    const historyItems = [];
    
    todos.forEach(todo => {
      // Add creation event
      historyItems.push({
        id: `${todo.id}-created`,
        todoId: todo.id,
        action: 'created',
        text: todo.text,
        timestamp: todo.createdAt || new Date().toISOString(),
        priority: todo.priority
      });
      
      // Add completion event if completed
      if (todo.completedAt) {
        historyItems.push({
          id: `${todo.id}-completed`,
          todoId: todo.id,
          action: 'completed',
          text: todo.text,
          timestamp: todo.completedAt,
          priority: todo.priority
        });
      }
      
      // Add update events if they exist
      if (todo.updatedAt && todo.updatedAt !== todo.createdAt) {
        historyItems.push({
          id: `${todo.id}-updated`,
          todoId: todo.id,
          action: 'updated',
          text: todo.text,
          timestamp: todo.updatedAt,
          priority: todo.priority
        });
      }
    });
    
    setHistory(historyItems);
  }, [todos]);

  // Filter and sort history
  const filteredHistory = history
    .filter(item => filter === 'all' || item.action === filter)
    .sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      
      if (sortOrder === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

  const getActionLabel = (action) => {
    switch (action) {
      case 'created': return 'Created';
      case 'completed': return 'Completed';
      case 'updated': return 'Updated';
      default: return action;
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'created': return <AddIcon sx={{ fontSize: 16 }} />;
      case 'completed': return <CheckIcon sx={{ fontSize: 16 }} />;
      case 'updated': return <EditIcon sx={{ fontSize: 16 }} />;
      default: return null;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'created': return 'primary';
      case 'completed': return 'success';
      case 'updated': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box sx={{ width: '100%' }} role="region" aria-label="Todo History">
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ fontWeight: 600 }}
            id="history-heading"
          >
            Todo History
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }} aria-labelledby="history-heading">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="history-filter-label">Filter by Action</InputLabel>
                <Select
                  labelId="history-filter-label"
                  id="history-filter"
                  value={filter}
                  label="Filter by Action"
                  onChange={(e) => setFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                  aria-describedby="filter-help-text"
                >
                  <MenuItem value="all">All Actions</MenuItem>
                  <MenuItem value="created">Created</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="updated">Updated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="history-sort-label">Sort By</InputLabel>
                <Select
                  labelId="history-sort-label"
                  id="history-sort"
                  value={sortOrder}
                  label="Sort By"
                  onChange={(e) => setSortOrder(e.target.value)}
                  sx={{ borderRadius: 2 }}
                  aria-describedby="sort-help-text"
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {filteredHistory.length > 0 ? (
            <Box 
              sx={{ 
                maxHeight: 500, 
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
              }}
              role="list"
              aria-label="History items"
            >
              {filteredHistory.map(item => (
                <Card 
                  key={item.id} 
                  variant="outlined" 
                  sx={{ 
                    mb: 2, 
                    borderRadius: 2,
                    borderLeft: 4,
                    borderLeftColor: getActionColor(item.action) === 'primary' ? 'primary.main' : 
                                    getActionColor(item.action) === 'success' ? 'success.main' : 
                                    getActionColor(item.action) === 'warning' ? 'warning.main' : 
                                    'grey.300',
                    '&:hover': {
                      boxShadow: 2,
                      borderColor: 'grey.300',
                    }
                  }}
                  role="listitem"
                >
                  <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Chip
                        icon={getActionIcon(item.action)}
                        label={getActionLabel(item.action)}
                        color={getActionColor(item.action)}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontWeight: 500,
                          height: 24,
                          '& .MuiChip-icon': {
                            color: getActionColor(item.action) === 'primary' ? theme.palette.primary.main : 
                                   getActionColor(item.action) === 'success' ? theme.palette.success.main : 
                                   getActionColor(item.action) === 'warning' ? theme.palette.warning.main : 
                                   theme.palette.grey[500]
                          }
                        }}
                        aria-label={`${getActionLabel(item.action)} action`}
                      />
                      <Typography variant="caption" color="text.secondary" aria-label={`Timestamp: ${formatDate(item.timestamp)}`}>
                        {formatDate(item.timestamp)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1, wordBreak: 'break-word' }}>
                      {item.text}
                    </Typography>
                    {item.priority && (
                      <Chip
                        label={`${item.priority} priority`}
                        size="small"
                        variant="filled"
                        sx={{
                          backgroundColor: item.priority === 'high' ? theme.palette.error.light : 
                                          item.priority === 'medium' ? theme.palette.warning.light : 
                                          theme.palette.info.light,
                          color: item.priority === 'high' ? theme.palette.error.contrastText : 
                                 item.priority === 'medium' ? theme.palette.warning.contrastText : 
                                 theme.palette.info.contrastText,
                          height: 20,
                          '& .MuiChip-label': {
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            px: 0.5
                          }
                        }}
                        aria-label={`Priority: ${item.priority}`}
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }} aria-live="polite">
              <Typography variant="h4" sx={{ mb: 2 }} aria-hidden="true">
                📜
              </Typography>
              <Typography variant="h6" color="text.secondary">
                No history items found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Complete some todos to see history
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EnhancedTodoHistory;