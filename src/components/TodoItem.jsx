import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import notificationService from '../services/notificationService';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);
  const [editedDueDate, setEditedDueDate] = useState(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
  const [editedPriority, setEditedPriority] = useState(todo.priority || 'medium');
  const [editedNotes, setEditedNotes] = useState(todo.notes || '');
  const [editedTags, setEditedTags] = useState(todo.tags ? todo.tags.join(', ') : '');

  const handleToggleComplete = async () => {
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      });
      if (response.ok) {
        onUpdate(todo.id, { ...todo, completed: !todo.completed });
      } else {
        notificationService.error('Failed to update todo.');
      }
    } catch (error) {
      notificationService.error('Network error.');
    }
  };

  const handleSaveEdit = async () => {
    const tagsArray = editedTags.split(',').map(tag => tag.trim()).filter(Boolean);
    const updatedTodo = {
      text: editedText,
      dueDate: editedDueDate,
      priority: editedPriority,
      notes: editedNotes,
      tags: tagsArray,
    };

    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo)
      });
      if (response.ok) {
        onUpdate(todo.id, { ...todo, ...updatedTodo });
        setIsEditing(false);
        notificationService.success('Todo updated successfully!');
      } else {
        notificationService.error('Failed to update todo.');
      }
    } catch (error) {
      notificationService.error('Network error.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/todos/${todo.id}`, { method: 'DELETE' });
      if (response.ok) {
        onDelete(todo.id);
        notificationService.success('Todo deleted successfully!');
      } else {
        notificationService.error('Failed to delete todo.');
      }
    } catch (error) {
      notificationService.error('Network error.');
    }
  };

  const priorityColor = {
    high: theme.palette.error.main,
    medium: theme.palette.warning.main,
    low: theme.palette.success.main,
  };

  return (
    <>
      <ListItem
        divider
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderLeft: `4px solid ${priorityColor[todo.priority] || theme.palette.grey[400]}`,
          opacity: todo.completed ? 0.6 : 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: theme.palette.action.hover,
          },
        }}
      >
        <Checkbox
          edge="start"
          checked={todo.completed}
          onChange={handleToggleComplete}
          tabIndex={-1}
          disableRipple
        />
        <ListItemText
          primary={
            <Typography
              variant="body1"
              sx={{ fontWeight: 'bold', textDecoration: todo.completed ? 'line-through' : 'none' }}
            >
              {todo.text}
            </Typography>
          }
          secondary={
            <Box component="span" sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
              {todo.notes && <Typography variant="body2" color="text.secondary">{todo.notes}</Typography>}
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                {todo.dueDate && (
                  <Chip
                    icon={<CalendarIcon />}
                    label={new Date(todo.dueDate).toLocaleDateString()}
                    size="small"
                  />
                )}
                {todo.tags?.map(tag => <Chip key={tag} label={tag} size="small" />)}
              </Box>
            </Box>
          }
        />
        <Box>
          <IconButton onClick={() => setIsEditing(true)}><EditIcon /></IconButton>
          <IconButton onClick={handleDelete}><DeleteIcon /></IconButton>
        </Box>
      </ListItem>

      <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Todo text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={editedDueDate}
                onChange={(e) => setEditedDueDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editedPriority}
                  onChange={(e) => setEditedPriority(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                value={editedTags}
                onChange={(e) => setEditedTags(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={4}
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)} startIcon={<CloseIcon />}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" startIcon={<SaveIcon />}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TodoItem;