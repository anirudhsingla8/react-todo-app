import { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';
import TodoFilters from './TodoFilters';
import TodoStats from './TodoStats';

const TodoList = ({ todos }) => {
  const [filteredTodos, setFilteredTodos] = useState(todos);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    let filtered = [...todos];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(term) ||
        (todo.notes && todo.notes.toLowerCase().includes(term)) ||
        (todo.tags && todo.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }

    if (filterStatus === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(todo => !todo.completed);
    }

    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate) : new Date(0);
          bValue = b.dueDate ? new Date(b.dueDate) : new Date(0);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'text':
          aValue = a.text.toLowerCase();
          bValue = b.text.toLowerCase();
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    setFilteredTodos(filtered);
  }, [todos, searchTerm, filterStatus, sortBy, sortOrder]);

  return (
    <div>
      <AddTodoForm />
      <TodoFilters
        onFilterChange={(filter) => setFilterStatus(filter.status)}
        onSortChange={(by, order) => {
          setSortBy(by);
          setSortOrder(order);
        }}
        onSearchChange={setSearchTerm}
      />
      <TodoStats todos={todos} />
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
