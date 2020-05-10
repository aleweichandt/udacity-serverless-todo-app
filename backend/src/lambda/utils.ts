import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { parseUserId } from "../auth/utils";
import { HandledError } from "../models/Error";

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function handleError(error: Error | HandledError): APIGatewayProxyResult {
  if('statusCode' in error) {
    // is handled
    const handledError = error as HandledError
    return {
      statusCode: handledError.statusCode,
      body: JSON.stringify({ message: handledError.message })
    }
  } else {
    throw error
  }
}