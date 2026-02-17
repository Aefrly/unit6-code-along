const express = require('express');
const app = express();
const port = 3000;
const { body, validationResult } = require('express-validator');

// Sample todo data
const todos = [
    {
        id: 1,
        task: "Complete project proposal",
        description: "Write and submit the final project proposal for the client",
        priority: "high",
        completed: false,
        dueDate: "2024-01-15",
        tags: ["work", "urgent"]
    },
    {
        id: 2,
        task: "Review code changes",
        description: "Review pull requests from team members",
        priority: "medium",
        completed: true,
        dueDate: "2024-01-12",
        tags: ["development", "review"]
    },
    {
        id: 3,
        task: "Update documentation",
        description: "Update API documentation with new endpoints",
        priority: "low",
        completed: false,
        dueDate: "2024-01-20",
        tags: ["documentation"]
    },
    {
        id: 4,
        task: "Team meeting",
        description: "Weekly team standup meeting",
        priority: "medium",
        completed: false,
        dueDate: "2024-01-14",
        tags: ["meeting", "team"]
    }
];

// Built-in middleware for parsing JSON
app.use(express.json());

// Custom middleware for logging requests
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  
    // Log request body for POST and PUT requests
    if (req.method === 'POST' || req.method === 'PUT') {
         console.log('Request Body:',
   JSON.stringify(req.body, null, 2));
}
  
    next(); // Pass control to next middleware
};

// Custom logging middleware
app.use(requestLogger);

// Complete validation rules for todos
const todoValidation = [
  body('task')
    .isLength({ min: 3 })
    .withMessage('Task must be at least 3 characters long'),
  
  body('description')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  
  body('priority')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  
  body('dueDate')
    .isISO8601()
    .withMessage('Due date must be a valid date (YYYY-MM-DD)'),
  
  body('tags')
    .isArray({ min: 1 })
    .withMessage('Tags must be an array with at least one tag'),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be true or false')
];

// Routes
app.get('/api/todos', (req, res) => {
    res.json(todos);
});

app.get('/api/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todo = todos.find(t => t.id === todoId);
    
    if (todo) {
        res.json(todo);
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});

app.post('/api/todos', (req, res) => {
    const { task, description, priority, dueDate, tags } = req.body;
  
    const newTodo = {
        id: todos.length + 1,
        task,
        description,
        priority,
        completed: false,
        dueDate,
        tags
    };
  
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const { task, description, priority, completed, dueDate, tags } = req.body;
    
    const todoIndex = todos.findIndex(t => t.id === todoId);
    
    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    todos[todoIndex] = {
        id: todoId,
        task,
        description,
        priority,
        completed,
        dueDate,
        tags
    };
    
    res.json(todos[todoIndex]);
});

app.delete('/api/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todoIndex = todos.findIndex(t => t.id === todoId);
    
    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    const deletedTodo = todos.splice(todoIndex, 1)[0];
    res.json({ message: 'Todo deleted', todo: deletedTodo });
});

app.listen(port, () => {
    console.log(`Todo API running at http://localhost:${port}`);
});