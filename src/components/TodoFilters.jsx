import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as PendingIcon,
  AllInclusive as AllIcon,
} from '@mui/icons-material';

const TodoFilters = ({ todos = [], onFilterChange, onSortChange, onSearchChange }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterPriority, setFilterPriority] = useState('all');

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    onSearchChange(term);
  };

  const handleFilterStatus = (event, newStatus) => {
    if (newStatus !== null) {
      setFilterStatus(newStatus);
      onFilterChange({ status: newStatus, priority: filterPriority });
    }
  };

  const handleFilterPriority = (event) => {
    const priority = event.target.value;
    setFilterPriority(priority);
    onFilterChange({ status: filterStatus, priority });
  };

  const handleSort = (event) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
    onSortChange(newSortBy, sortOrder);
  };

  const handleSortOrder = (event) => {
    const newSortOrder = event.target.value;
    setSortOrder(newSortOrder);
    onSortChange(sortBy, newSortOrder);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Filters & Sort
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <ToggleButtonGroup
              value={filterStatus}
              exclusive
              onChange={handleFilterStatus}
              fullWidth
            >
              <ToggleButton value="all"><AllIcon sx={{ mr: 0.5 }} />All</ToggleButton>
              <ToggleButton value="completed"><CompletedIcon sx={{ mr: 0.5 }} />Completed</ToggleButton>
              <ToggleButton value="pending"><PendingIcon sx={{ mr: 0.5 }} />Pending</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select value={filterPriority} onChange={handleFilterPriority} label="Priority">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} onChange={handleSort} label="Sort By">
                <MenuItem value="createdAt">Date Created</MenuItem>
                <MenuItem value="dueDate">Due Date</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Order</InputLabel>
              <Select value={sortOrder} onChange={handleSortOrder} label="Order">
                <MenuItem value="asc">Asc</MenuItem>
                <MenuItem value="desc">Desc</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TodoFilters;