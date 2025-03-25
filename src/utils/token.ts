import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
import { HttpStatus } from './httpStatus.js';
import { HTTPException } from 'hono/http-exception';

dotenv.config();

export class Token {
  static secretKey = process.env.JWT_SECRET;
  static accessTokenDuration = process.env.ACCESS_TOKEN_DURATION || '1800';
  static refreshTokenDuration = process.env.REFRESH_TOKEN_DURATION || '7776000';

  static createToken(tokenId: string, payload: Object, tokenType: string) {

    const duration = (tokenType === 'access' ? parseInt(this.accessTokenDuration, 10) : parseInt(this.refreshTokenDuration, 10));

    // Add token-specific values to the payload
    const updatedPayload = {
      jti: tokenId,
      typ: tokenType,
      ...payload,
    };

    const token = jwt.sign(updatedPayload, this.secretKey || 'nothing', { expiresIn: duration });
    return token;
  }

  static verifyToken(token: string, secretKey=null) {
    try {
      // Decode and verify the token
      const decoded = jwt.verify(token, secretKey || this.secretKey || 'nothing');

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {

        throw new HTTPException(400, { message: 'Token expired' });
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new HTTPException(401, { message: error.message });
      }
      console.error(error);
      throw new Error('Token verify error');
    }
  }
}