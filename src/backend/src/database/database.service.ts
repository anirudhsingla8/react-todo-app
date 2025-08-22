import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as sqlite3 from 'sqlite3';
import { User } from '../users/user.interface';
import { Todo } from '../todos/todo.interface';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private db: sqlite3.Database;

  async onModuleInit() {
    // Initialize SQLite database
    this.db = new sqlite3.Database('todos.db');
    
    // Create tables if they don't exist
    await this.createTables();
  }

  async onModuleDestroy() {
    // Close database connection
    if (this.db) {
      this.db.close();
    }
  }

  private async createTables(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Create users table (enhanced)
        this.db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME,
            is_verified BOOLEAN DEFAULT FALSE,
            failed_login_attempts INTEGER DEFAULT 0,
            locked_until DATETIME NULL
          )
        `, (err) => {
          if (err) reject(err);
        });

        // Create todos table (enhanced)
        this.db.run(`
          CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            text TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed_at DATETIME NULL,
            due_date DATETIME NULL,
            tags TEXT, -- JSON array of tags
            priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
            notes TEXT,
            reminder DATETIME NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
          )
        `, (err) => {
          if (err) reject(err);
        });

        // Create todo history table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS todo_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            todo_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            action TEXT NOT NULL, -- 'created', 'updated', 'completed', 'deleted'
            old_value TEXT,
            new_value TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (todo_id) REFERENCES todos (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
          )
        `, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  // User methods
  async createUser(username: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              username,
              password,
              createdAt: new Date(),
              updatedAt: new Date(),
              isVerified: false,
              failedLoginAttempts: 0
            });
          }
        }
      );
    });
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else {
            if (row) {
              resolve({
                id: row.id,
                username: row.username,
                password: row.password,
                createdAt: new Date(row.created_at),
                updatedAt: new Date(row.updated_at),
                isVerified: row.is_verified === 1,
                failedLoginAttempts: row.failed_login_attempts
              });
            } else {
              resolve(undefined);
            }
          }
        }
      );
    });
  }

  async findUserById(id: number): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (err, row: any) => {
          if (err) {
            reject(err);
          } else {
            if (row) {
              resolve({
                id: row.id,
                username: row.username,
                password: row.password,
                createdAt: new Date(row.created_at),
                updatedAt: new Date(row.updated_at),
                isVerified: row.is_verified === 1,
                failedLoginAttempts: row.failed_login_attempts
              });
            } else {
              resolve(undefined);
            }
          }
        }
      );
    });
  }

  // Todo methods
  async createTodo(userId: number, text: string, options?: {
    dueDate?: Date;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high';
    notes?: string;
    reminder?: Date;
  }): Promise<Todo> {
    return new Promise((resolve, reject) => {
      const tagsJson = options?.tags ? JSON.stringify(options.tags) : '[]';
      
      this.db.run(
        'INSERT INTO todos (user_id, text, due_date, tags, priority, notes, reminder) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          userId,
          text,
          options?.dueDate?.toISOString() || null,
          tagsJson,
          options?.priority || 'medium',
          options?.notes || null,
          options?.reminder?.toISOString() || null
        ],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              userId,
              text,
              completed: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              dueDate: options?.dueDate,
              tags: options?.tags || [],
              priority: options?.priority || 'medium',
              notes: options?.notes,
              reminder: options?.reminder
            });
          }
        }
      );
    });
  }

  async findTodosByUserId(userId: number): Promise<Todo[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map(row => ({
              id: row.id,
              userId: row.user_id,
              text: row.text,
              completed: row.completed === 1,
              createdAt: new Date(row.created_at),
              updatedAt: new Date(row.updated_at),
              completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
              dueDate: row.due_date ? new Date(row.due_date) : undefined,
              tags: row.tags ? JSON.parse(row.tags) : [],
              priority: row.priority || 'medium',
              notes: row.notes || undefined,
              reminder: row.reminder ? new Date(row.reminder) : undefined
            })));
          }
        }
      );
    });
  }

  async updateTodoCompletion(id: number, completed: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // If marking as completed, set completed_at timestamp
      const completedAt = completed ? new Date().toISOString() : null;
      
      this.db.run(
        'UPDATE todos SET completed = ?, completed_at = ? WHERE id = ?',
        [completed ? 1 : 0, completedAt, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  async updateTodo(id: number, updates: Partial<Todo>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Build dynamic update query
      const fields: string[] = [];
      const values: any[] = [];
      
      // Handle each possible field update
      if (updates.text !== undefined) {
        fields.push('text = ?');
        values.push(updates.text);
      }
      
      if (updates.completed !== undefined) {
        fields.push('completed = ?');
        values.push(updates.completed ? 1 : 0);
        
        // If marking as completed, set completed_at timestamp
        if (updates.completed) {
          fields.push('completed_at = ?');
          values.push(new Date().toISOString());
        } else {
          fields.push('completed_at = ?');
          values.push(null);
        }
      }
      
      if (updates.dueDate !== undefined) {
        fields.push('due_date = ?');
        values.push(updates.dueDate ? updates.dueDate.toISOString() : null);
      }
      
      if (updates.tags !== undefined) {
        fields.push('tags = ?');
        values.push(JSON.stringify(updates.tags));
      }
      
      if (updates.priority !== undefined) {
        fields.push('priority = ?');
        values.push(updates.priority);
      }
      
      if (updates.notes !== undefined) {
        fields.push('notes = ?');
        values.push(updates.notes);
      }
      
      if (updates.reminder !== undefined) {
        fields.push('reminder = ?');
        values.push(updates.reminder ? updates.reminder.toISOString() : null);
      }
      
      // Always update the updated_at timestamp
      fields.push('updated_at = ?');
      values.push(new Date().toISOString());
      
      // Add the id for the WHERE clause
      values.push(id);
      
      if (fields.length === 1) {
        // Only updated_at was updated, which we always do
        resolve(true);
        return;
      }
      
      const query = `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`;
      
      this.db.run(query, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  async deleteTodo(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM todos WHERE id = ?',
        [id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }
}