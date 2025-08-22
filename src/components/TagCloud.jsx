import React, { useState, useEffect } from 'react';

const TagCloud = ({ todos }) => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  // Extract and count tags from todos
  useEffect(() => {
    const tagCount = {};
    
    todos.forEach(todo => {
      if (todo.tags && Array.isArray(todo.tags)) {
        todo.tags.forEach(tag => {
          const normalizedTag = tag.trim().toLowerCase();
          if (normalizedTag) {
            tagCount[normalizedTag] = (tagCount[normalizedTag] || 0) + 1;
          }
        });
      }
    });
    
    // Convert to array and sort by count
    const tagArray = Object.entries(tagCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    setTags(tagArray);
  }, [todos]);

  // Calculate tag size based on frequency
  const getTagSize = (count) => {
    const minSize = 0.8;
    const maxSize = 2.0;
    const maxCount = Math.max(...tags.map(t => t.count), 1);
    const size = minSize + (count / maxCount) * (maxSize - minSize);
    return size;
  };

  // Calculate tag color based on frequency
  const getTagColor = (count) => {
    const maxCount = Math.max(...tags.map(t => t.count), 1);
    const intensity = Math.floor(150 + (count / maxCount) * 105); // 150 to 255
    return `rgb(${intensity}, ${255 - intensity}, 100)`;
  };

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="tag-cloud">
      <h2>Popular Tags</h2>
      
      <div className="tags-container">
        {tags.map((tag, index) => (
          <span
            key={`${tag.name}-${index}`}
            className={`tag ${selectedTag === tag.name ? 'selected' : ''}`}
            style={{
              fontSize: `${getTagSize(tag.count)}rem`,
              color: getTagColor(tag.count),
              backgroundColor: selectedTag === tag.name ? 'rgba(52, 152, 219, 0.1)' : 'transparent'
            }}
            onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
          >
            {tag.name}
            <span className="tag-count">{tag.count}</span>
          </span>
        ))}
      </div>
      
      {selectedTag && (
        <div className="selected-tag-info">
          <h3>Todos tagged with "{selectedTag}"</h3>
          <ul className="tagged-todos">
            {todos
              .filter(todo => 
                todo.tags && 
                Array.isArray(todo.tags) && 
                todo.tags.some(tag => tag.trim().toLowerCase() === selectedTag)
              )
              .map(todo => (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <span className="todo-text">{todo.text}</span>
                  <span className="todo-date">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))
            }
          </ul>
          <button 
            onClick={() => setSelectedTag(null)}
            className="clear-selection"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default TagCloud;