import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Client } from '@notionhq/client';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

const notion = new Client({
  auth: NOTION_API_KEY,
  notionVersion: '2026-03-11',
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
      throw new Error('Missing environment variables');
    }

    const database = await notion.databases.retrieve({
      database_id: NOTION_DATABASE_ID,
    });

    if (!('data_sources' in database)) {
      throw new Error('Database data_sources not found');
    }

    const dataSourceId = database.data_sources?.[0]?.id;

    if (!dataSourceId) {
      throw new Error('Data source not found');
    }

    const query: Parameters<typeof notion.dataSources.query>[0] = {
      data_source_id: dataSourceId,
      sorts: [{ property: '公開日', direction: 'descending' }],
    };

    const tag = event.queryStringParameters?.tag;

    if (tag) {
      query.filter = {
        property: 'タグ',
        multi_select: { contains: tag },
      };
    }

    const response = await notion.dataSources.query(query);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: message }),
    };
  }
};
