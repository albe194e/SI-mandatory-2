const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

// Determine the server URL (local or production)
const serverUrl = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Webhook Exposee API',
    version: '1.0.0',
    description: 'API to register, unregister, and send notifications to webhooks',
    contact: {
      name: 'Support',
      url: 'https://example.com',
    },
  },
  servers: [
    {
      url: serverUrl,
      description: process.env.VERCEL_URL ? 'Production server' : 'Development server',
    },
  ],
  tags: [
    {
      name: 'Webhooks',
      description: 'Webhook management endpoints',
    },
  ],
  components: {
    schemas: {
      WebhookRequest: {
        type: 'object',
        required: ['url', 'events'],
        properties: {
          url: {
            type: 'string',
            description: 'The URL where webhooks will be sent',
            example: 'https://example.com/webhook',
          },
          events: {
            type: 'array',
            description: 'Array of event types to subscribe to',
            items: {
              type: 'string',
              enum: [
                'payment_received',
                'invoice_processed',
                'order_created',
                'order_shipped',
              ],
            },
            example: ['payment_received', 'invoice_processed'],
          },
          description: {
            type: 'string',
            description: 'Optional description of the webhook',
            example: 'My payment events webhook',
          },
        },
      },
      Webhook: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique webhook identifier',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          url: {
            type: 'string',
            description: 'The URL where webhooks will be sent',
            example: 'https://example.com/webhook',
          },
          events: {
            type: 'array',
            description: 'Array of event types subscribed to',
            items: {
              type: 'string',
            },
            example: ['payment_received', 'invoice_processed'],
          },
          description: {
            type: 'string',
            description: 'Description of the webhook',
            example: 'My payment events webhook',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the webhook was created',
            example: '2025-05-13T14:30:45.123Z',
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, './server.js')],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
