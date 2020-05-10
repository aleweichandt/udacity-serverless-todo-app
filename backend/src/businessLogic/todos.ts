import * as uuid from 'uuid'
import { TodosAccess } from "../dataLayer/TodosAccess";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";

const todosAccess = new TodosAccess()

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