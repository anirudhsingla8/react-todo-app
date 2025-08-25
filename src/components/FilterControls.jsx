import React, { useState, useEffect } from 'react';
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
  Select,
  TextField,
  Typography,
  Avatar,
  useTheme,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Label as LabelIcon,
  PriorityHigh as PriorityHighIcon,
  Sort as SortIcon,
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as PendingIcon,
  AllInclusive as AllIcon,
} from '@mui/icons-material';

const FilterControls = ({ todos = [], onFilterChange, onSortChange, onSearchChange }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterTags, setFilterTags] = useState('all');
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const tagsSet = new Set();
    if (Array.isArray(todos)) {
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
    }
    setAvailableTags(Array.from(tagsSet).sort());
  }, [todos]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    onSearchChange(term);
  };

  const handleFilterStatus = (event, newStatus) => {
    if (newStatus !== null) {
      setFilterStatus(newStatus);
      onFilterChange({ status: newStatus, priority: filterPriority, tags: filterTags });
    }
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

  return (
    <Card variant="outlined" sx={{ boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 1.5 }}>
            <FilterIcon />
          </Avatar>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            Search & Filters
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              placeholder="Search todos by text, notes, or tags..."
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

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card variant="outlined" sx={{ height: '100%', p: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.dark, width: 36, height: 36, mr: 1.5 }}>
                    <FilterIcon sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.primary.dark }}>
                    Filters
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Status</Typography>
                    <ToggleButtonGroup
                      value={filterStatus}
                      exclusive
                      onChange={handleFilterStatus}
                      aria-label="text alignment"
                      fullWidth
                    >
                      <ToggleButton value="all" aria-label="all">
                        <AllIcon sx={{ mr: 1 }} />
                        All
                      </ToggleButton>
                      <ToggleButton value="completed" aria-label="completed">
                        <CompletedIcon sx={{ mr: 1 }} />
                        Completed
                      </ToggleButton>
                      <ToggleButton value="pending" aria-label="pending">
                        <PendingIcon sx={{ mr: 1 }} />
                        Pending
                      </ToggleButton>
                    </ToggleButtonGroup>
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
                                backgroundColor: theme.palette.priority.high,
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
                                backgroundColor: theme.palette.priority.medium,
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
                                backgroundColor: theme.palette.priority.low,
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

                  <Grid item xs={12} sm={6}>
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
                                backgroundColor: theme.palette.primary.main,
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

          <Grid item xs={12} md={5}>
            <Card variant="outlined" sx={{ height: '100%', p: 1 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                  <Avatar sx={{ bgcolor: theme.palette.success.dark, width: 36, height: 36, mr: 1.5 }}>
                    <SortIcon sx={{ fontSize: 22 }} />
                  </Avatar>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: theme.palette.success.dark }}>
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
  );
};

export default FilterControls;
