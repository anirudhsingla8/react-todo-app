import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
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
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import notificationService from '../services/notificationService';


const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);
  const [editedDueDate, setEditedDueDate] = useState(todo.dueDate ? new Date(todo.dueDate) : null);
  const [editedPriority, setEditedPriority] = useState(todo.priority || 'medium');
  const [editedNotes, setEditedNotes] = useState(todo.notes || '');
  const [editedTags, setEditedTags] = useState(todo.tags ? todo.tags.join(', ') : '');

  const handleToggleComplete = async () => {
    try {
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: todo.id, 
          completed: !todo.completed 
        })
      });
      
      if (response.ok) {
        onUpdate(todo.id, { completed: !todo.completed });
      } else {
        const error = await response.json();
        notificationService.error(error.message || 'Failed to update todo');
      }
    } catch (error) {
      notificationService.error('Network error. Please try again.');
    }
  };

  const handleSaveEdit = async () => {
    try {
      const tagsArray = editedTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: editedText,
          dueDate: editedDueDate ? editedDueDate.toISOString() : null,
          priority: editedPriority,
          notes: editedNotes,
          tags: tagsArray
        })
      });
      
      if (response.ok) {
        const updatedTodo = {
          ...todo,
          text: editedText,
          dueDate: editedDueDate,
          priority: editedPriority,
          notes: editedNotes,
          tags: tagsArray
        };
        onUpdate(todo.id, updatedTodo);
        setIsEditing(false);
        notificationService.success('Todo updated successfully!');
      } else {
        const error = await response.json();
        notificationService.error(error.message || 'Failed to update todo');
      }
    } catch (error) {
      notificationService.error('Network error. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('/api/todos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: todo.id })
      });
      
      if (response.ok) {
        onDelete(todo.id);
        notificationService.success('Todo deleted successfully!');
      } else {
        const error = await response.json();
        notificationService.error(error.message || 'Failed to delete todo');
      }
    } catch (error) {
      notificationService.error('Network error. Please try again.');
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  if (isEditing) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Todo text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              variant="outlined"
            />
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={editedDueDate ? new Date(editedDueDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setEditedDueDate(e.target.value ? new Date(e.target.value) : null)}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
              
              <FormControl sx={{ minWidth: 120 }}>
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
            </Box>
            
            <TextField
              fullWidth
              label="Additional notes"
              multiline
              rows={3}
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Tags (comma separated)"
              value={editedTags}
              onChange={(e) => setEditedTags(e.target.value)}
              variant="outlined"
            />
            
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveEdit}
                color="primary"
              >
                Save
              </Button>
              <Button
                startIcon={<CloseIcon />}
                onClick={() => setIsEditing(false)}
                color="secondary"
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card
        sx={{
          mb: 2,
          borderLeft: `4px solid ${theme.palette.priority[todo.priority] || theme.palette.text.disabled}`,
          opacity: todo.completed ? 0.7 : 1
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={todo.completed}
                onChange={handleToggleComplete}
              />
              <Typography
                variant="body1"
                sx={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  fontWeight: todo.completed ? 'normal' : 'bold'
                }}
              >
                {todo.text}
              </Typography>
            </Box>
            
            <Box>
              <IconButton
                size="small"
                onClick={() => setIsEditing(true)}
                aria-label={`Edit todo: ${todo.text}`}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleOpenDeleteDialog}
                aria-label={`Delete todo: ${todo.text}`}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {todo.dueDate && (
              <Chip
                icon={<CalendarIcon />}
                label={`Due: ${formatDate(todo.dueDate)}`}
                size="small"
                color="primary"
                variant="outlined"
                aria-label={`Due date: ${formatDate(todo.dueDate)}`}
              />
            )}
            
            {todo.priority && (
              <Chip
                label={todo.priority}
                size="small"
                sx={{
                  backgroundColor: theme.palette.priority[todo.priority] || theme.palette.grey[500],
                  color: '#fff'
                }}
                aria-label={`Priority: ${todo.priority}`}
              />
            )}
            
            {todo.tags && todo.tags.length > 0 && (
              todo.tags.map((tag, index) => (
                <Chip
                  label={tag}
                  size="small"
                  key={index}
                  variant="outlined"
                  aria-label={`Tag: ${tag}`}
                />
              ))
            )}
          </Box>
          
          {todo.notes && (
            <Typography variant="body2" color="text.secondary">
              {todo.notes}
            </Typography>
          )}
        </CardContent>
      </Card>
      
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this todo? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
            handleDelete();
            handleCloseDeleteDialog();
          }} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TodoItem;