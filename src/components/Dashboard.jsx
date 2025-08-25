import {
  AppBar,
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material';
import {
  Logout as LogoutIcon,
  ListAlt as ListAltIcon,
  Add as AddIcon
} from '@mui/icons-material';
import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';
import TodoFilters from './TodoFilters';
import TodoStats from './TodoStats';

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
  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            TodoApp
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>{user.username}</Typography>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
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
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {/* Main Content */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AddIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Add New Todo</Typography>
                      </Box>
                      <AddTodoForm user={user} onAddTodo={onAddTodo} />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ListAltIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Your Todos</Typography>
                      </Box>
                      {loading ? (
                        <Typography color="text.secondary">Loading...</Typography>
                      ) : filteredTodos.length > 0 ? (
                        <Box sx={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto', p: 0.5 }}>
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
                        <Typography color="text.secondary">No todos found.</Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TodoStats todos={todos} />
                </Grid>
                <Grid item xs={12}>
                  <TodoFilters
                    todos={todos}
                    onFilterChange={onFilterChange}
                    onSortChange={onSortChange}
                    onSearchChange={onSearchChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;