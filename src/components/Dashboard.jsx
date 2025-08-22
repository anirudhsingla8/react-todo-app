import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  History as HistoryIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Notifications as NotificationsIcon,
  LocalOffer as TagIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';
import TodoStats from './TodoStats';
import TodoHistory from './TodoHistory';
import UpcomingReminders from './UpcomingReminders';
import TodoCalendar from './TodoCalendar';
import TagCloud from './TagCloud';
import TodoAnalytics from './TodoAnalytics';
import TodoFilters from './TodoFilters';
import TodoReminders from './TodoReminders';
import TodoPriorities from './TodoPriorities';
import EnhancedTodoHistory from './EnhancedTodoHistory';


const Dashboard = ({ 
  user, 
  todos, 
  filteredTodos, 
  loading, 
  searchTerm, 
  filterStatus, 
  sortBy, 
  sortOrder, 
  onLogout, 
  onFilterChange, 
  onSortChange, 
  onSearchChange, 
  onAddTodo, 
  onUpdateTodo, 
  onDeleteTodo 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderOverviewContent = () => (
    <Grid container spacing={3}>
      {/* Quick Stats Section */}
      <Grid item xs={12} sm={6} md={4}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChartIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Quick Stats</Typography>
            </Box>
            <TodoStats todos={todos} />
          </CardContent>
        </Card>
      </Grid>

      {/* Add Todo Section */}
      <Grid item xs={12} sm={6} md={4}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AddIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Add New Todo</Typography>
            </Box>
            <AddTodoForm user={user} onAddTodo={onAddTodo} />
          </CardContent>
        </Card>
      </Grid>

      {/* Filters Section */}
      <Grid item xs={12} sm={6} md={4}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Filters & Search</Typography>
            </Box>
            <TodoFilters
              todos={todos}
              onFilterChange={onFilterChange}
              onSortChange={onSortChange}
              onSearchChange={onSearchChange}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Reminders Section */}
      <Grid item xs={12} sm={6} md={4}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Upcoming Reminders</Typography>
            </Box>
            <UpcomingReminders todos={todos} />
          </CardContent>
        </Card>
      </Grid>

      {/* Priorities Section */}
      <Grid item xs={12} sm={6} md={4}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChartIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Priority Overview</Typography>
            </Box>
            <TodoPriorities todos={todos} />
          </CardContent>
        </Card>
      </Grid>

      {/* Tag Cloud Section */}
      <Grid item xs={12} sm={6} md={4}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TagIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Tag Cloud</Typography>
            </Box>
            <TagCloud todos={todos} />
          </CardContent>
        </Card>
      </Grid>

      {/* Todo List Section - Full Width */}
      <Grid item xs={12}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DashboardIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Your Todos</Typography>
              <Badge badgeContent={filteredTodos.length} color="primary" sx={{ ml: 2 }} />
            </Box>
            {loading && todos.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">Loading todos...</Typography>
              </Box>
            ) : filteredTodos.length > 0 ? (
              <ul className="todo-list" role="list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {filteredTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onUpdate={onUpdateTodo}
                    onDelete={onDeleteTodo}
                  />
                ))}
              </ul>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h2" sx={{ mb: 2 }}>📝</Typography>
                <Typography variant="h5" sx={{ mb: 1 }}>No todos found</Typography>
                <Typography color="text.secondary">
                  {todos.length > 0 ? 'No todos match your filter criteria.' : 'No todos yet. Add one above!'}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAnalyticsContent = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChartIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Todo Analytics</Typography>
            </Box>
            <TodoAnalytics todos={todos} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Calendar View</Typography>
            </Box>
            <TodoCalendar todos={todos} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Reminder Settings</Typography>
            </Box>
            <TodoReminders todos={todos} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderHistoryContent = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HistoryIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Enhanced History</Typography>
            </Box>
            <EnhancedTodoHistory todos={todos} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HistoryIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Simple History</Typography>
            </Box>
            <TodoHistory todos={todos} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'analytics':
        return renderAnalyticsContent();
      case 'history':
        return renderHistoryContent();
      default:
        return renderOverviewContent();
    }
  };

  const drawerWidth = 200;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          boxShadow: '0 2px 10px rgba(33, 150, 243, 0.3)',
          py: 1
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', pr: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DashboardIcon sx={{ fontSize: 32, color: '#fff' }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: '#fff' }}>
              TodoApp Dashboard
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
              Welcome back, {user.username}!
            </Typography>
            <Avatar sx={{ bgcolor: '#fff', color: '#2196F3', fontWeight: 'bold', width: 40, height: 40 }}>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <IconButton
              color="inherit"
              onClick={onLogout}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                ml: 1
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: 'none',
            marginTop: '72px',
            height: 'calc(100vh - 72px)',
            backgroundColor: '#f8f9fa',
            boxShadow: '2px 0 5px rgba(0, 0, 0, 0.05)'
          },
        }}
      >
        <List sx={{ pt: 2 }}>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              sx={{
                borderRadius: '0 24px 24px 0',
                mx: 1,
                '&.Mui-selected': {
                  backgroundColor: '#2196F3',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#1976D2'
                  }
                },
                '&:hover': {
                  backgroundColor: '#e3f2fd'
                }
              }}
            >
              <ListItemIcon sx={{
                color: activeTab === 'overview' ? '#fff' : 'inherit',
                minWidth: 40
              }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Overview" sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: activeTab === 'overview' ? 600 : 400
                }
              }} />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={activeTab === 'analytics'}
              onClick={() => setActiveTab('analytics')}
              sx={{
                borderRadius: '0 24px 24px 0',
                mx: 1,
                '&.Mui-selected': {
                  backgroundColor: '#2196F3',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#1976D2'
                  }
                },
                '&:hover': {
                  backgroundColor: '#e3f2fd'
                }
              }}
            >
              <ListItemIcon sx={{
                color: activeTab === 'analytics' ? '#fff' : 'inherit',
                minWidth: 40
              }}>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Analytics" sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: activeTab === 'analytics' ? 600 : 400
                }
              }} />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
              sx={{
                borderRadius: '0 24px 24px 0',
                mx: 1,
                '&.Mui-selected': {
                  backgroundColor: '#2196F3',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#1976D2'
                  }
                },
                '&:hover': {
                  backgroundColor: '#e3f2fd'
                }
              }}
            >
              <ListItemIcon sx={{
                color: activeTab === 'history' ? '#fff' : 'inherit',
                minWidth: 40
              }}>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="History" sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: activeTab === 'history' ? 600 : 400
                }
              }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
        <Toolbar /> {/* This pushes content below the AppBar */}
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Box sx={{ backgroundColor: '#fff', borderRadius: 3, minHeight: 360, p: 3, boxShadow: 1 }}>
            {renderContent()}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;