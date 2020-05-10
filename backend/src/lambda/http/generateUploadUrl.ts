import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId, handleError } from '../utils'
import { getTodoImageUrlForUser } from '../../businessLogic/todos'

const logger = createLogger('generateUploadUrl')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event', { event })
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  try {
    const uploadUrl = await getTodoImageUrlForUser(todoId, userId)
    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl })
    }
  } catch(error) {
    handleError(error)
  }
})

handler.use(cors({ credentials: true }))
