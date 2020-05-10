import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX
    ) { }

    async getTodosForUser(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all Todos for user', {
            userId
        })

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        logger.info('Todos for user found', { size: items.length})
        return items as TodoItem[]
    }

    async getTodoWithId(todoId: string): Promise<TodoItem> {
        logger.info('Getting Todo with id', { todoId })

        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'todoId = :todoId',
            ExpressionAttributeValues: { ':todoId' : todoId }
        }).promise()
        
        if(result.Items.length < 1) {
            logger.error('Todo with it not found', { todoId })
            throw new Error('not found')
        }

        const item = result.Items[0]
        logger.info('Todo with id found', {item})

        return item as TodoItem
    }

    async createTodo(item: TodoItem): Promise<TodoItem> {
        logger.info('Adding todo with info',  item)
        const result = await this.docClient.put({
            TableName: this.todosTable,
            Item: item
        }).promise()

        const createdItem = result.Attributes 
        logger.info('Todo added',  { item: createdItem })

        return createdItem as TodoItem
    }

    async updateTodo(item: TodoItem, update: TodoUpdate): Promise<TodoItem> {
        logger.info('Update todo with info',  {item, update})
        const { createdAt, todoId } = item
        const result = await this.docClient.update({
            TableName: this.todosTable,
            Key: { todoId, createdAt },
            UpdateExpression: 'set #todoName=:name, dueDate=:dueDate, done=:done',
            ExpressionAttributeNames: { '#todoName': 'name' },
            ExpressionAttributeValues:{
                ":name": update.name,
                ":dueDate": update.dueDate,
                ":done": update.done
            },
            ReturnValues:"ALL_NEW"
        }).promise()

        const updatedItem = result.Attributes 
        logger.info('Todo updated',  { item: updatedItem })

        return updatedItem as TodoItem
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        logger.info('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}
