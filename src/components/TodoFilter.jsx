import React, { useState } from 'react';

const TodoFilter = ({ 
  todos, 
  onFilterChange,
  onSortChange,
  onSearchChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSearch = (term) => {
    setSearchTerm(term);
    onSearchChange(term);
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
    onFilterChange(status);
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

  return (
    <div className="todo-filter">
      <div className="filter-stats">
        <span className="stat-item">
          Total: <strong>{totalTodos}</strong>
        </span>
        <span className="stat-item">
          Completed: <strong>{completedTodos}</strong>
        </span>
        <span className="stat-item">
          Pending: <strong>{pendingTodos}</strong>
        </span>
      </div>

      <div className="filter-controls">
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search todos..."
            className="search-input"
            aria-label="Search todos"
          />
          {searchTerm && (
            <button 
              onClick={() => handleSearch('')}
              className="clear-search"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-dropdowns">
          <select
            value={filterStatus}
            onChange={(e) => handleFilter(e.target.value)}
            className="filter-select"
            aria-label="Filter by status"
          >
            <option value="all">All Todos</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="sort-select"
            aria-label="Sort by"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="text">Alphabetical</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => handleSortOrder(e.target.value)}
            className="order-select"
            aria-label="Sort order"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TodoFilter;