import { TodosAccess } from "../dataLayer/TodosAccess";
import { TodoItem } from "../models/TodoItem";

const todosAccess = new TodosAccess()

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    return todosAccess.getTodosForUser(userId)
}