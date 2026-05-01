import type { APIGatewayRequestAuthorizerEventV2, APIGatewaySimpleAuthorizerResult } from 'aws-lambda';

export const handler = async (event: APIGatewayRequestAuthorizerEventV2): Promise<APIGatewaySimpleAuthorizerResult> => {
  const API_KEY = process.env.AWS_API_KEY;

  // ヘッダー取得（大小文字対策）
  const headers = event.headers || {};
  const requestApiKey = headers['x-api-key'] || headers['X-Api-Key'] || headers['X-API-KEY'];

  return {
    isAuthorized: requestApiKey === API_KEY,
  };
};
