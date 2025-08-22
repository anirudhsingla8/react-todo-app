"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const sqlite3 = __importStar(require("sqlite3"));
let DatabaseService = class DatabaseService {
    async onModuleInit() {
        this.db = new sqlite3.Database('todos.db');
        await this.createTables();
    }
    async onModuleDestroy() {
        if (this.db) {
            this.db.close();
        }
    }
    async createTables() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
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
                    if (err)
                        reject(err);
                });
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
                    if (err)
                        reject(err);
                });
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
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        });
    }
    async createUser(username, password) {
        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function (err) {
                if (err) {
                    reject(err);
                }
                else {
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
            });
        });
    }
    async findUserByUsername(username) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
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
                    }
                    else {
                        resolve(undefined);
                    }
                }
            });
        });
    }
    async findUserById(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
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
                    }
                    else {
                        resolve(undefined);
                    }
                }
            });
        });
    }
    async createTodo(userId, text, options) {
        return new Promise((resolve, reject) => {
            var _a, _b;
            const tagsJson = (options === null || options === void 0 ? void 0 : options.tags) ? JSON.stringify(options.tags) : '[]';
            this.db.run('INSERT INTO todos (user_id, text, due_date, tags, priority, notes, reminder) VALUES (?, ?, ?, ?, ?, ?, ?)', [
                userId,
                text,
                ((_a = options === null || options === void 0 ? void 0 : options.dueDate) === null || _a === void 0 ? void 0 : _a.toISOString()) || null,
                tagsJson,
                (options === null || options === void 0 ? void 0 : options.priority) || 'medium',
                (options === null || options === void 0 ? void 0 : options.notes) || null,
                ((_b = options === null || options === void 0 ? void 0 : options.reminder) === null || _b === void 0 ? void 0 : _b.toISOString()) || null
            ], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        id: this.lastID,
                        userId,
                        text,
                        completed: false,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        dueDate: options === null || options === void 0 ? void 0 : options.dueDate,
                        tags: (options === null || options === void 0 ? void 0 : options.tags) || [],
                        priority: (options === null || options === void 0 ? void 0 : options.priority) || 'medium',
                        notes: options === null || options === void 0 ? void 0 : options.notes,
                        reminder: options === null || options === void 0 ? void 0 : options.reminder
                    });
                }
            });
        });
    }
    async findTodosByUserId(userId) {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
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
            });
        });
    }
    async updateTodoCompletion(id, completed) {
        return new Promise((resolve, reject) => {
            const completedAt = completed ? new Date().toISOString() : null;
            this.db.run('UPDATE todos SET completed = ?, completed_at = ? WHERE id = ?', [completed ? 1 : 0, completedAt, id], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.changes > 0);
                }
            });
        });
    }
    async updateTodo(id, updates) {
        return new Promise((resolve, reject) => {
            const fields = [];
            const values = [];
            if (updates.text !== undefined) {
                fields.push('text = ?');
                values.push(updates.text);
            }
            if (updates.completed !== undefined) {
                fields.push('completed = ?');
                values.push(updates.completed ? 1 : 0);
                if (updates.completed) {
                    fields.push('completed_at = ?');
                    values.push(new Date().toISOString());
                }
                else {
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
            fields.push('updated_at = ?');
            values.push(new Date().toISOString());
            values.push(id);
            if (fields.length === 1) {
                resolve(true);
                return;
            }
            const query = `UPDATE todos SET ${fields.join(', ')} WHERE id = ?`;
            this.db.run(query, values, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.changes > 0);
                }
            });
        });
    }
    async deleteTodo(id) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM todos WHERE id = ?', [id], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.changes > 0);
                }
            });
        });
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)()
], DatabaseService);
//# sourceMappingURL=database.service.js.map