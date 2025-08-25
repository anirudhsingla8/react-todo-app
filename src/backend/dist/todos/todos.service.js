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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_service_1 = require("../users/users.service");
const todo_schema_1 = require("./todo.schema");
let TodosService = class TodosService {
    constructor(todoModel, usersService) {
        this.todoModel = todoModel;
        this.usersService = usersService;
    }
    async create(userId, text, options) {
        const user = await this.usersService.findOneById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const newTodo = new this.todoModel(Object.assign({ userId,
            text }, options));
        return newTodo.save();
    }
    async findAllByUserId(userId) {
        const user = await this.usersService.findOneById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return this.todoModel.find({ userId }).exec();
    }
    async updateCompletion(id, completed) {
        const result = await this.todoModel.updateOne({ _id: id }, { completed, completedAt: completed ? new Date() : null }).exec();
        return result.acknowledged && result.modifiedCount > 0;
    }
    async update(id, updates) {
        const result = await this.todoModel.updateOne({ _id: id }, updates).exec();
        return result.acknowledged && result.modifiedCount > 0;
    }
    async delete(id) {
        const result = await this.todoModel.deleteOne({ _id: id }).exec();
        return result.acknowledged && result.deletedCount > 0;
    }
};
exports.TodosService = TodosService;
exports.TodosService = TodosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(todo_schema_1.Todo.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, users_service_1.UsersService])
], TodosService);
//# sourceMappingURL=todos.service.js.map