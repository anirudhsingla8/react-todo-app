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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const users_service_1 = require("../users/users.service");
let TodosService = class TodosService {
    constructor(databaseService, usersService) {
        this.databaseService = databaseService;
        this.usersService = usersService;
    }
    async create(userId, text, options) {
        const user = await this.usersService.findOneById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return await this.databaseService.createTodo(userId, text, options);
    }
    async findAllByUserId(userId) {
        const user = await this.usersService.findOneById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return await this.databaseService.findTodosByUserId(userId);
    }
    async updateCompletion(id, completed) {
        return await this.databaseService.updateTodoCompletion(id, completed);
    }
    async update(id, updates) {
        return await this.databaseService.updateTodo(id, updates);
    }
    async delete(id) {
        return await this.databaseService.deleteTodo(id);
    }
};
exports.TodosService = TodosService;
exports.TodosService = TodosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        users_service_1.UsersService])
], TodosService);
//# sourceMappingURL=todos.service.js.map