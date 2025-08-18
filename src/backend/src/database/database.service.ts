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
        // Create users table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) reject(err);
        });

        // Create todos table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            text TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
              createdAt: new Date()
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
                createdAt: new Date(row.created_at)
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
                createdAt: new Date(row.created_at)
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
  async createTodo(userId: number, text: string): Promise<Todo> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO todos (user_id, text) VALUES (?, ?)',
        [userId, text],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              userId,
              text,
              completed: false,
              createdAt: new Date()
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
              createdAt: new Date(row.created_at)
            })));
          }
        }
      );
    });
  }

  async updateTodo(id: number, completed: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE todos SET completed = ? WHERE id = ?',
        [completed ? 1 : 0, id],
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