import React from 'react';
import {
  Box,
 Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Chip,
  Avatar
} from '@mui/material';
import {
  Assignment as TotalIcon,
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as PendingIcon,
  Error as OverdueIcon,
  Today as TodayIcon,
  Schedule as SoonIcon,
  Label as TagIcon,
  PriorityHigh as PriorityIcon
} from '@mui/icons-material';

const TodoStats = ({ todos }) => {
  // Calculate statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  
  // Calculate completion percentage
  const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  
  // Count todos by priority
  const priorityCounts = {
    high: todos.filter(todo => todo.priority === 'high').length,
    medium: todos.filter(todo => todo.priority === 'medium').length,
    low: todos.filter(todo => todo.priority === 'low').length
  };
  
  // Count todos by due date status
  const dueDateStats = {
    overdue: 0,
    dueToday: 0,
    dueSoon: 0,
    noDueDate: 0
  };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  todos.forEach(todo => {
    if (!todo.dueDate) {
      dueDateStats.noDueDate++;
      return;
    }
    
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      dueDateStats.overdue++;
    } else if (dueDate.getTime() === today.getTime()) {
      dueDateStats.dueToday++;
    } else if (dueDate < nextWeek) {
      dueDateStats.dueSoon++;
    }
  });
  
  // Count todos with tags
  const taggedTodos = todos.filter(todo => todo.tags && todo.tags.length > 0).length;
  
  // Priority colors
  const priorityColors = {
    high: '#f44336',
    medium: '#ff9800',
    low: '#4caf50'
  };
  
  // Due date colors
  const dueDateColors = {
    overdue: '#f44336',
    dueToday: '#ff9800',
    dueSoon: '#2196f3',
    noDueDate: '#9e9e9e'
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        {/* Main Stats */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Avatar sx={{ bgcolor: '#2196f3', mb: 1 }}>
                    <TotalIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {totalTodos}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
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
                  display: 'flex', 
                  flexDirection: 'column',
                  borderLeft: `4px solid #4caf50`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Avatar sx={{ bgcolor: '#4caf50', mb: 1 }}>
                    <CompletedIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {completedTodos}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
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
                  display: 'flex', 
                  flexDirection: 'column',
                  borderLeft: `4px solid #ff9800`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Avatar sx={{ bgcolor: '#ff9800', mb: 1 }}>
                    <PendingIcon />
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {pendingTodos}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
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
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#9c27b0', mr: 1 }}>
                      <TotalIcon />
                    </Avatar>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {completionPercentage}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={completionPercentage} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#9c27b0'
                      }
                    }} 
                  />
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    Completion Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Priority Stats */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#f5057', mr: 1 }}>
                  <PriorityIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  By Priority
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      borderLeft: `4px solid ${priorityColors.high}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: priorityColors.high }}>
                        {priorityCounts.high}
                      </Typography>
                      <Chip 
                        label="High" 
                        size="small" 
                        sx={{ 
                          backgroundColor: priorityColors.high,
                          color: 'white',
                          fontWeight: 'bold'
                        }} 
                      />
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      borderLeft: `4px solid ${priorityColors.medium}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: priorityColors.medium }}>
                        {priorityCounts.medium}
                      </Typography>
                      <Chip 
                        label="Medium" 
                        size="small" 
                        sx={{ 
                          backgroundColor: priorityColors.medium,
                          color: 'white',
                          fontWeight: 'bold'
                        }} 
                      />
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      borderLeft: `4px solid ${priorityColors.low}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: priorityColors.low }}>
                        {priorityCounts.low}
                      </Typography>
                      <Chip 
                        label="Low" 
                        size="small" 
                        sx={{ 
                          backgroundColor: priorityColors.low,
                          color: 'white',
                          fontWeight: 'bold'
                        }} 
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Due Date Stats */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#3f51b5', mr: 1 }}>
                  <TodayIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  By Due Date
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      borderLeft: `4px solid ${dueDateColors.overdue}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Avatar sx={{ bgcolor: dueDateColors.overdue, width: 32, height: 32, mx: 'auto', mb: 1 }}>
                        <OverdueIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: dueDateColors.overdue }}>
                        {dueDateStats.overdue}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Overdue
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      borderLeft: `4px solid ${dueDateColors.dueToday}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Avatar sx={{ bgcolor: dueDateColors.dueToday, width: 32, height: 32, mx: 'auto', mb: 1 }}>
                        <TodayIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: dueDateColors.dueToday }}>
                        {dueDateStats.dueToday}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Today
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      borderLeft: `4px solid ${dueDateColors.dueSoon}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Avatar sx={{ bgcolor: dueDateColors.dueSoon, width: 32, height: 32, mx: 'auto', mb: 1 }}>
                        <SoonIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: dueDateColors.dueSoon }}>
                        {dueDateStats.dueSoon}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Soon
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      borderLeft: `4px solid ${dueDateColors.noDueDate}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Avatar sx={{ bgcolor: dueDateColors.noDueDate, width: 32, height: 32, mx: 'auto', mb: 1 }}>
                        <TagIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: dueDateColors.noDueDate }}>
                        {dueDateStats.noDueDate}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        No Date
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Other Stats */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#00bcd4', mr: 1 }}>
                  <TagIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Other Statistics
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%', 
                      textAlign: 'center',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Avatar sx={{ bgcolor: '#00bcd4', width: 48, height: 48, mx: 'auto', mb: 1 }}>
                        <TagIcon />
                      </Avatar>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#00bcd4' }}>
                        {taggedTodos}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tagged Tasks
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TodoStats;