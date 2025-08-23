import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  LinearProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  ListAlt as ListAltIcon,
} from '@mui/icons-material';
import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';
import TodoFilters from './TodoFilters';

const Dashboard = ({ 
  user, 
  todos, 
  filteredTodos, 
  loading, 
  onLogout, 
  onFilterChange, 
  onSortChange, 
  onSearchChange, 
  onAddTodo, 
  onUpdateTodo, 
  onDeleteTodo 
}) => {
  const completed = todos.filter(todo => todo.completed).length;
  const completionRate = todos.length > 0 ? Math.round((completed / todos.length) * 100) : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        }}
      >
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Todo Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>{user.username}</Typography>
            <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.dark' }}>
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <IconButton
              color="inherit"
              onClick={onLogout}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
        <Toolbar />
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {/* Left Column: Add and Filter */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Add a new Todo</Typography>
                    <AddTodoForm user={user} onAddTodo={onAddTodo} />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Filter & Sort</Typography>
                    <TodoFilters
                      todos={todos}
                      onFilterChange={onFilterChange}
                      onSortChange={onSortChange}
                      onSearchChange={onSearchChange}
                    />
                  </CardContent>
                </Card>
                 <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Progress</Typography>
                     <Box sx={{ width: '100%', mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom align="center">
                          Completion Rate: {completionRate}%
                        </Typography>
                        <LinearProgress variant="determinate" value={completionRate} sx={{ height: 10, borderRadius: 5 }} />
                      </Box>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>

            {/* Right Column: Todo List */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ListAltIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Your Todos</Typography>
                    <Badge badgeContent={filteredTodos.length} color="primary" sx={{ ml: 2 }} />
                  </Box>
                  {loading ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">Loading todos...</Typography>
                    </Box>
                  ) : filteredTodos.length > 0 ? (
                    <Box sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto', p: 0.5 }}>
                      {filteredTodos.map(todo => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          onUpdate={onUpdateTodo}
                          onDelete={onDeleteTodo}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="h5" sx={{ mb: 1 }}>No todos found</Typography>
                      <Typography color="text.secondary">
                        {todos.length > 0 ? 'Try adjusting your filters.' : 'Add a new todo to get started!'}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;