import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Client } from '@notionhq/client';

const NOTION_API_KEY = process.env.NOTION_API_KEY;

const notion = new Client({
  auth: NOTION_API_KEY,
  notionVersion: '2026-03-11',
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!NOTION_API_KEY) {
      throw new Error('Missing environment variables');
    }

    const id = event.pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'id is required' }),
      };
    }

    /**
     * ① ページ情報取得
     */
    const pageMeta = await notion.pages.retrieve({
      page_id: id,
    });

    /**
     * ② ブロック取得
     */
    const pageBlocks = await notion.blocks.children.list({
      block_id: id,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        meta: pageMeta,
        blocks: pageBlocks,
      }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: message,
      }),
    };
  }
};
