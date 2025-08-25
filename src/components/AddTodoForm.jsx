import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import notificationService from '../services/notificationService';

const AddTodoForm = ({ user, onAddTodo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!text.trim()) {
      notificationService.error('Please enter a todo item.');
      return;
    }

    setIsLoading(true);
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          text: text.trim(),
          dueDate: dueDate || null,
          priority,
          notes: notes.trim(),
          tags: tagsArray,
        })
      });

      if (response.ok) {
        const newTodo = await response.json();
        onAddTodo(newTodo);
        // Reset form
        setText('');
        setDueDate('');
        setPriority('medium');
        setNotes('');
        setTags('');
        notificationService.success('Todo added successfully!');
      } else {
        const error = await response.json();
        notificationService.error(error.message || 'Failed to add todo.');
      }
    } catch (error) {
      notificationService.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="What needs to be done?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Priority"
            >
              <MenuItem value="low">
                <Chip label="Low" size="small" color="success" />
              </MenuItem>
              <MenuItem value="medium">
                <Chip label="Medium" size="small" color="warning" />
              </MenuItem>
              <MenuItem value="high">
                <Chip label="High" size="small" color="error" />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={isLoading}
            startIcon={<AddIcon />}
          >
            {isLoading ? 'Adding...' : 'Add Todo'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddTodoForm;