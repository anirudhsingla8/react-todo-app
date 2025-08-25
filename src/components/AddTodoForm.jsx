import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  Chip,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Event as EventIcon,
  Notes as NotesIcon,
  Label as LabelIcon,
  Notifications as NotificationsIcon,
  PriorityHigh as PriorityIcon
} from '@mui/icons-material';
import notificationService from '../services/notificationService';

const AddTodoForm = ({ user, onAddTodo }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [reminder, setReminder] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (values) => {
    const { text, dueDate, priority, notes, tags, reminder } = values;
    if (!text?.trim()) {
      notificationService.error('Please enter a todo item');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Convert tags string to array
      const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          text: text.trim(),
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          priority: priority || 'medium',
          notes: notes?.trim() || null,
          tags: tagsArray,
          reminder: reminder ? new Date(reminder).toISOString() : null
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
        setReminder('');
        
        notificationService.success('Todo added successfully!');
      } else {
        const error = await response.json();
        notificationService.error(error.message || 'Failed to add todo. Please try again.');
      }
    } catch (error) {
      notificationService.error('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleExpand = () => {
    setExpanded(!expanded);
  };

 return (
    <Card variant="outlined" sx={{ width: '100%', boxShadow: 2 }}>
      <CardContent>
        <Box component="form" onSubmit={(e) => {
          e.preventDefault();
          handleSubmit({ text, dueDate, priority, notes, tags, reminder });
        }} sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="What needs to be done?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
              variant="outlined"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AddIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={<AddIcon />}
              fullWidth
              sx={{
                py: 1.5,
                color: 'white',
                background: theme.palette.gradients.primary,
              }}
            >
              {isLoading ? 'Adding...' : 'Add Todo'}
            </Button>
            
            <Box sx={{ mt: 1 }}>
              <Button
                onClick={handleExpand}
                endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                fullWidth
                sx={{
                  justifyContent: 'space-between',
                  textTransform: 'none',
                  py: 1.5,
                  backgroundColor: theme.palette.grey[100],
                  '&:hover': {
                    backgroundColor: theme.palette.grey[200],
                  }
                }}
              >
                <Typography variant="body1">More Options</Typography>
              </Button>
              
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Card variant="outlined" sx={{ mt: 2, borderColor: 'divider' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        fullWidth
                        label="Due Date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      
                      <FormControl fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                          label="Priority"
                          startAdornment={
                            <InputAdornment position="start">
                              <PriorityIcon />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="low">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                size="small"
                                label="Low"
                                sx={{
                                  backgroundColor: theme.palette.priority.low,
                                  color: 'white',
                                  height: 20
                                }}
                              />
                              <span>Low Priority</span>
                            </Box>
                          </MenuItem>
                          <MenuItem value="medium">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                size="small"
                                label="Medium"
                                sx={{
                                  backgroundColor: theme.palette.priority.medium,
                                  color: 'white',
                                  height: 20
                                }}
                              />
                              <span>Medium Priority</span>
                            </Box>
                          </MenuItem>
                          <MenuItem value="high">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                size="small"
                                label="High"
                                sx={{
                                  backgroundColor: theme.palette.priority.high,
                                  color: 'white',
                                  height: 20
                                }}
                              />
                              <span>High Priority</span>
                            </Box>
                          </MenuItem>
                        </Select>
                        <FormHelperText>Set the priority level for this task</FormHelperText>
                      </FormControl>
                      
                      <TextField
                        fullWidth
                        label="Notes"
                        multiline
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Additional notes..."
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <NotesIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Tags (comma separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="work, personal, urgent"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LabelIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Reminder"
                        type="datetime-local"
                        value={reminder}
                        onChange={(e) => setReminder(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <NotificationsIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Collapse>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddTodoForm;