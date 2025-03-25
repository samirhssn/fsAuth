export enum HttpStatus {
  OK = 200, // Request succeeded
  CREATED = 201, // Resource created
  ACCEPTED = 202, // Request accepted, processing pending
  NO_CONTENT = 204, // Request succeeded, no content returned

  BAD_REQUEST = 400, // Client-side error
  UNAUTHORIZED = 401, // Authentication required
  FORBIDDEN = 403, // Server understood the request but refuses to authorize | if app gets this response then it should logout
  NOT_FOUND = 404, // Resource not found
  CONFLICT = 409, // Conflict in request (e.g., duplicate data)
  UNPROCESSABLE_ENTITY = 422, // Validation errors
  TOO_MANY_REQUESTS = 429,

  INTERNAL_SERVER_ERROR = 500, // Generic server error
  NOT_IMPLEMENTED = 501, // Not implemented on server
  BAD_GATEWAY = 502, // Invalid response from upstream server
  SERVICE_UNAVAILABLE = 503, // Server unavailable
  GATEWAY_TIMEOUT = 504, // Upstream server timeout
}
