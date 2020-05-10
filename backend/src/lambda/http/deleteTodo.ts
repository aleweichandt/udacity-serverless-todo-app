import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId, handleError } from '../utils'
import { deleteTodoWithIdForUser } from '../../businessLogic/todos'

const logger = createLogger('deleteTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event', { event })
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  try {
    const item = await deleteTodoWithIdForUser(todoId, userId)
    return {
      statusCode: 200,
      body: JSON.stringify({ item })
    }
  } catch(error) {
    return handleError(error)
  }
})

handler.use(cors({ credentials: true }))
