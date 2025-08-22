import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
  Avatar,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Assignment as TotalIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as PendingIcon,
  Error as OverdueIcon,
  FilterList as FilterIcon,
  Label as LabelIcon,
  PriorityHigh as PriorityHighIcon,
  Sort as SortIcon
} from '@mui/icons-material';

const TodoFilters = ({ todos, onFilterChange, onSortChange, onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterTags, setFilterTags] = useState('all');
  const [availableTags, setAvailableTags] = useState([]);

  // Extract available tags from todos
  React.useEffect(() => {
    const tagsSet = new Set();
    
    todos.forEach(todo => {
      if (todo.tags && Array.isArray(todo.tags)) {
        todo.tags.forEach(tag => {
          const normalizedTag = tag.trim().toLowerCase();
          if (normalizedTag) {
            tagsSet.add(normalizedTag);
          }
        });
      }
    });
    
    setAvailableTags(Array.from(tagsSet).sort());
  }, [todos]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    onSearchChange(term);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    onFilterChange({ status, priority: filterPriority, tags: filterTags });
  };

  const handleFilterPriority = (priority) => {
    setFilterPriority(priority);
    onFilterChange({ status: filterStatus, priority, tags: filterTags });
  };

  const handleFilterTags = (tag) => {
    setFilterTags(tag);
    onFilterChange({ status: filterStatus, priority: filterPriority, tags: tag });
  };

  const handleSort = (criteria) => {
    setSortBy(criteria);
    onSortChange(criteria, sortOrder);
  };

  const handleSortOrder = (order) => {
    setSortOrder(order);
    onSortChange(sortBy, order);
  };

 // Calculate counts
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const overdueTodos = todos.filter(todo => {
    if (!todo.completed && todo.dueDate) {
      const dueDate = new Date(todo.dueDate);
      const now = new Date();
      dueDate.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      return dueDate < now;
    }
    return false;
  }).length;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Stats Section */}
        <Card variant="outlined" sx={{ boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#1976d2', mr: 1 }}>
                <TotalIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                Task Statistics
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent>
                    <Avatar sx={{ bgcolor: '#2196f3', width: 48, height: 48, mx: 'auto', mb: 1 }}>
                      <TotalIcon />
                    </Avatar>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                      {totalTodos}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Tasks
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    borderLeft: `4px solid #4caf50`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent>
                    <Avatar sx={{ bgcolor: '#4caf50', width: 48, height: 48, mx: 'auto', mb: 1 }}>
                      <CompletedIcon />
                    </Avatar>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      {completedTodos}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    borderLeft: `4px solid #ff9800`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent>
                    <Avatar sx={{ bgcolor: '#ff9800', width: 48, height: 48, mx: 'auto', mb: 1 }}>
                      <PendingIcon />
                    </Avatar>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                      {pendingTodos}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    borderLeft: `4px solid #f44336`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent>
                    <Avatar sx={{ bgcolor: '#f44336', width: 48, height: 48, mx: 'auto', mb: 1 }}>
                      <OverdueIcon />
                    </Avatar>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                      {overdueTodos}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Overdue
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Search and Filters Section */}
        <Card variant="outlined" sx={{ boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#9c27b0', mr: 1 }}>
                <FilterIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                Search & Filters
              </Typography>
            </Box>
            
            {/* Search Field */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  placeholder="Search todos..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleSearch('')}
                          size="small"
                        >
                          <CloseIcon />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Filters Grid */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#3f51b5', width: 32, height: 32, mr: 1 }}>
                        <FilterIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography variant="subtitle1" component="div">
                        Filters
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={filterStatus}
                            onChange={(e) => handleFilterStatus(e.target.value)}
                            label="Status"
                            startAdornment={
                              <InputAdornment position="start">
                                <AssignmentIcon />
                              </InputAdornment>
                            }
                          >
                            <MenuItem value="all">All Todos</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Priority</InputLabel>
                          <Select
                            value={filterPriority}
                            onChange={(e) => handleFilterPriority(e.target.value)}
                            label="Priority"
                            startAdornment={
                              <InputAdornment position="start">
                                <PriorityHighIcon />
                              </InputAdornment>
                            }
                          >
                            <MenuItem value="all">All Priorities</MenuItem>
                            <MenuItem value="high">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  size="small"
                                  label="High"
                                  sx={{
                                    backgroundColor: '#f4336',
                                    color: 'white',
                                    height: 20
                                  }}
                                />
                                <span>High</span>
                              </Box>
                            </MenuItem>
                            <MenuItem value="medium">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  size="small"
                                  label="Medium"
                                  sx={{
                                    backgroundColor: '#ff9800',
                                    color: 'white',
                                    height: 20
                                  }}
                                />
                                <span>Medium</span>
                              </Box>
                            </MenuItem>
                            <MenuItem value="low">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  size="small"
                                  label="Low"
                                  sx={{
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                    height: 20
                                  }}
                                />
                                <span>Low</span>
                              </Box>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel>Tags</InputLabel>
                          <Select
                            value={filterTags}
                            onChange={(e) => handleFilterTags(e.target.value)}
                            label="Tags"
                            startAdornment={
                              <InputAdornment position="start">
                                <LabelIcon />
                              </InputAdornment>
                            }
                          >
                            <MenuItem value="all">All Tags</MenuItem>
                            {availableTags.map(tag => (
                              <MenuItem key={tag} value={tag}>
                                <Chip
                                  size="small"
                                  label={tag}
                                  sx={{
                                    backgroundColor: '#2196f3',
                                    color: 'white',
                                    mr: 1
                                  }}
                                />
                                {tag}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#009688', width: 32, height: 32, mr: 1 }}>
                        <SortIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography variant="subtitle1" component="div">
                        Sorting
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Sort By</InputLabel>
                          <Select
                            value={sortBy}
                            onChange={(e) => handleSort(e.target.value)}
                            label="Sort By"
                            startAdornment={
                              <InputAdornment position="start">
                                <SortIcon />
                              </InputAdornment>
                            }
                          >
                            <MenuItem value="createdAt">Date Created</MenuItem>
                            <MenuItem value="dueDate">Due Date</MenuItem>
                            <MenuItem value="priority">Priority</MenuItem>
                            <MenuItem value="text">Alphabetical</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Order</InputLabel>
                          <Select
                            value={sortOrder}
                            onChange={(e) => handleSortOrder(e.target.value)}
                            label="Order"
                            startAdornment={
                              <InputAdornment position="start">
                                <SortIcon />
                              </InputAdornment>
                            }
                          >
                            <MenuItem value="desc">Descending</MenuItem>
                            <MenuItem value="asc">Ascending</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default TodoFilters;