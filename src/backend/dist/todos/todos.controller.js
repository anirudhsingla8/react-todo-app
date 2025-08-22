"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosController = void 0;
const common_1 = require("@nestjs/common");
const todos_service_1 = require("./todos.service");
const users_service_1 = require("../users/users.service");
let TodosController = class TodosController {
    constructor(todosService, usersService) {
        this.todosService = todosService;
        this.usersService = usersService;
    }
    async getTodos(username) {
        if (!username) {
            throw new common_1.HttpException('Username is required', common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.usersService.findOneByUsername(username);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const todos = await this.todosService.findAllByUserId(user.id);
        return todos;
    }
    async createTodo(body) {
        const { username, text, dueDate, tags, priority, notes, reminder } = body;
        if (!username || !text) {
            throw new common_1.HttpException('Username and text are required', common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.usersService.findOneByUsername(username);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const todo = await this.todosService.create(user.id, text, {
            dueDate: dueDate ? new Date(dueDate) : undefined,
            tags: tags || [],
            priority: priority || 'medium',
            notes,
            reminder: reminder ? new Date(reminder) : undefined
        });
        return todo;
    }
    async updateTodo(body) {
        const { id, completed } = body;
        if (id === undefined) {
            throw new common_1.HttpException('Todo ID is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.todosService.updateCompletion(id, completed);
            if (!result) {
                throw new common_1.HttpException('Todo not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { id, completed };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to update todo', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateTodoFields(id, body) {
        try {
            const updates = {};
            if (body.text !== undefined)
                updates.text = body.text;
            if (body.completed !== undefined)
                updates.completed = body.completed;
            if (body.dueDate !== undefined)
                updates.dueDate = new Date(body.dueDate);
            if (body.tags !== undefined)
                updates.tags = body.tags;
            if (body.priority !== undefined)
                updates.priority = body.priority;
            if (body.notes !== undefined)
                updates.notes = body.notes;
            if (body.reminder !== undefined)
                updates.reminder = new Date(body.reminder);
            const result = await this.todosService.update(parseInt(id), updates);
            if (!result) {
                throw new common_1.HttpException('Todo not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { message: 'Todo updated successfully' };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to update todo', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteTodo(body) {
        const { id } = body;
        if (id === undefined) {
            throw new common_1.HttpException('Todo ID is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.todosService.delete(id);
            if (!result) {
                throw new common_1.HttpException('Todo not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { message: 'Todo deleted successfully' };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to delete todo', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.TodosController = TodosController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "getTodos", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "createTodo", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "updateTodo", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "updateTodoFields", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TodosController.prototype, "deleteTodo", null);
exports.TodosController = TodosController = __decorate([
    (0, common_1.Controller)('todos'),
    __metadata("design:paramtypes", [todos_service_1.TodosService,
        users_service_1.UsersService])
], TodosController);
//# sourceMappingURL=todos.controller.js.map