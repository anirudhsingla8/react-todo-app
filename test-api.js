const http = require('http');

// Test the backend API
async function testApi() {
  console.log('Testing API connection...');
  
  // Test data
  const testUser = {
    username: 'testuser',
    password: 'TestPass123!'
  };
  
  // Test signup
  try {
    const signupResponse = await fetch('http://localhost:3000/api/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });
    
    console.log('Signup response status:', signupResponse.status);
    const signupData = await signupResponse.json();
    console.log('Signup response:', signupData);
    
    if (signupResponse.ok) {
      console.log('✓ Signup successful');
      
      // Test login
      const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser)
      });
      
      console.log('Login response status:', loginResponse.status);
      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);
      
      if (loginResponse.ok) {
        console.log('✓ Login successful');
        
        // Test adding a todo
        const todoData = {
          username: testUser.username,
          text: 'Test todo item'
        };
        
        const todoResponse = await fetch('http://localhost:3000/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(todoData)
        });
        
        console.log('Todo creation response status:', todoResponse.status);
        const todoDataResponse = await todoResponse.json();
        console.log('Todo creation response:', todoDataResponse);
        
        if (todoResponse.ok) {
          console.log('✓ Todo creation successful');
          
          // Test getting todos
          const getTodosResponse = await fetch(`http://localhost:3000/api/todos?username=${testUser.username}`);
          
          console.log('Get todos response status:', getTodosResponse.status);
          const todosData = await getTodosResponse.json();
          console.log('Get todos response:', todosData);
          
          if (getTodosResponse.ok) {
            console.log('✓ Get todos successful');
            console.log('All tests passed!');
          } else {
            console.log('✗ Get todos failed');
          }
        } else {
          console.log('✗ Todo creation failed');
        }
      } else {
        console.log('✗ Login failed');
      }
    } else {
      console.log('✗ Signup failed');
    }
  } catch (error) {
    console.error('Error testing API:', error.message);
    console.log('Make sure the backend server is running on port 3000');
  }
}

testApi();