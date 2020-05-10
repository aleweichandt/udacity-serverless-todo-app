import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils';
import { getAllTodos } from '../../businessLogic/todos';

const logger = createLogger('getTodos');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event', { event })

  const userId = getUserId(event)

  const items = await getAllTodos(userId)

  return {
    statusCode: 200,
    body: JSON.stringify({ items })
  }
})

handler.use(cors({ credentials: true }))
