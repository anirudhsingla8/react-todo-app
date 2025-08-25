import React from 'react';
import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TotalIcon from '@mui/icons-material/Assignment';
import TodoStats from './TodoStats';
import FilterControls from './FilterControls';

const TodoFilters = ({ todos = [], onFilterChange, onSortChange, onSearchChange }) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Card variant="outlined" sx={{ boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.dark, mr: 1 }}>
                <TotalIcon />
              </Avatar>
              <Typography variant="h6" component="div">
                Task Statistics
              </Typography>
            </Box>
            <TodoStats todos={todos} />
          </CardContent>
        </Card>

        <FilterControls
          todos={todos}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
          onSearchChange={onSearchChange}
        />
      </Box>
    </Box>
  );
};

export default TodoFilters;