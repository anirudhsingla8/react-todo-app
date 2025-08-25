import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  useTheme,
  Avatar
} from '@mui/material';
import {
  Assignment as TotalIcon,
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as PendingIcon,
  PriorityHigh as PriorityIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ textAlign: 'center' }}>
      <Avatar sx={{ bgcolor: color, margin: '0 auto 16px' }}>{icon}</Avatar>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{value}</Typography>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
    </CardContent>
  </Card>
);

const TodoStats = ({ todos }) => {
  const theme = useTheme();

  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  const highPriority = todos.filter(todo => todo.priority === 'high').length;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={completionPercentage}
                size={120}
                thickness={4}
                sx={{ color: theme.palette.primary.main }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h5" component="div" color="text.secondary">
                  {`${completionPercentage}%`}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <StatCard title="Total" value={totalTodos} icon={<TotalIcon />} color={theme.palette.info.main} />
              </Grid>
              <Grid item xs={6}>
                <StatCard title="Completed" value={completedTodos} icon={<CompletedIcon />} color={theme.palette.success.main} />
              </Grid>
              <Grid item xs={6}>
                <StatCard title="Pending" value={pendingTodos} icon={<PendingIcon />} color={theme.palette.warning.main} />
              </Grid>
              <Grid item xs={6}>
                <StatCard title="High Priority" value={highPriority} icon={<PriorityIcon />} color={theme.palette.error.main} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TodoStats;