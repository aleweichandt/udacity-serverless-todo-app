import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId, handleError } from '../utils'
import { updateTodoWithIdForUser } from '../../businessLogic/todos'

const logger = createLogger('updateTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event', { event })
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  try {
    const item = await updateTodoWithIdForUser(updatedTodo, todoId, userId)
    return {
      statusCode: 200,
      body: JSON.stringify({ item })
    }
  } catch(error) {
    return handleError(error)
  }
})

handler.use(cors({ credentials: true }))
