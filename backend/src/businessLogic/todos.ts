import * as uuid from 'uuid'
import { TodosAccess } from "../dataLayer/TodosAccess";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { NotFoundError, ForbiddenError } from '../models/Error';
import { createLogger } from '../utils/logger';

const todosAccess = new TodosAccess()

const logger = createLogger('todos')

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    return todosAccess.getTodosForUser(userId)
}

export async function createTodoForUser(request: CreateTodoRequest, userId: string) {
    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const item: TodoItem = {
        todoId,
        userId,
        createdAt,
        ...request,
        done: false
    }
    return todosAccess.createTodo(item)
}

export async function updateTodoWithIdForUser(request: UpdateTodoRequest, todoId: string, userId: string) {
    const matchingItem = await assertMatchingUser(todoId, userId)
    return todosAccess.updateTodo(matchingItem, request)
}

export async function deleteTodoWithIdForUser(todoId: string, userId: string) {
    const matchingItem = await assertMatchingUser(todoId, userId)
    return todosAccess.deleteTodo(matchingItem)
}

async function assertMatchingUser(todoId: string, userId: string): Promise<TodoItem> {
    let item: TodoItem = null
    try {
        item = await todosAccess.getTodoWithId(todoId)
    } catch(error) {
        logger.error('todo not found', { todoId })
        throw new NotFoundError("not found")
    }
    if(item && item.userId !== userId) {
        logger.error('todo with id does not belong to user', { todo: item, userId })
        throw new ForbiddenError("todo does not belong to this user")
    }
    return item
}