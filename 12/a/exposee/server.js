const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const cors = require('cors');

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors());

// Swagger/OpenAPI Setup

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
      url: 'https://8636-91-101-72-250.ngrok-free.app',
      description: 'Local development server',
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
            description: 'Optional description for the webhook',
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
            example: ['payment_received', 'order_shipped'],
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
  paths: {
    '/register-webhook': {
      post: {
        summary: 'Register a webhook URL to receive notifications',
        description: 'Register a webhook URL to listen for specific events.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/WebhookRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Webhook registered successfully',
          },
          400: {
            description: 'Invalid input: URL and events are required',
          },
        },
      },
    },
    '/unregister-webhook': {
      post: {
        summary: 'Unregister a previously registered webhook',
        description: 'Remove a previously registered webhook by its URL.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['url'],
                properties: {
                  url: {
                    type: 'string',
                    description: 'The URL of the webhook to unregister',
                    example: 'https://my-webhook.com',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Webhook unregistered successfully',
          },
          400: {
            description: 'URL is required',
          },
        },
      },
    },
    '/send-notification': {
      post: {
        summary: 'Send a notification to all registered webhooks',
        description: 'Sends a notification to all registered webhooks with a custom message.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['message'],
                properties: {
                  message: {
                    type: 'string',
                    description: 'The message content to send to webhooks',
                    example: 'Payment of $100 received',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Notification sent to all registered webhooks',
          },
          400: {
            description: 'Message is required',
          },
        },
      },
    },
    '/ping': {
      get: {
        summary: 'Ping all registered webhooks with a test payload',
        description: 'Pings all registered webhooks with a test payload to ensure they are alive.',
        parameters: [
          {
            in: 'query',
            name: 'testPayload',
            description: 'Optional test payload for the ping request',
            required: false,
            schema: {
              type: 'string',
              example: 'Ping Test Payload',
            },
          },
        ],
        responses: {
          200: {
            description: 'Ping sent to all registered webhooks',
          },
        },
      },
    },
    '/registered-webhooks': {
      get: {
        summary: 'Get all registered webhooks',
        description: 'Returns a list of all currently registered webhooks.',
        responses: {
          200: {
            description: 'List of registered webhooks',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    webhooks: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Webhook'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
};

// Initialize swagger-jsdoc with the above definition
const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: ['./server.js'], // This is to ensure the Swagger spec will point to the current file
});

// Serve Swagger UI at '/api-docs'
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// In-memory store for registered webhooks (you can replace this with a database in production)
let registeredWebhooks = [];

// Register Webhook Endpoint
app.post('/register-webhook', (req, res) => {
  const { url, events } = req.body;

  // Validate input
  if (!url || !Array.isArray(events)) {
    return res.status(400).json({ error: 'Invalid input: URL and events are required' });
  }

  // Save the webhook URL and events
  registeredWebhooks.push({ url, events });
  console.log(`Webhook registered: ${url} for events: ${events.join(', ')}`);

  res.status(200).json({ message: 'Webhook registered successfully' });
});

// Unregister Webhook Endpoint
app.post('/unregister-webhook', (req, res) => {
  const { url } = req.body;

  // Validate input
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Remove the webhook
  registeredWebhooks = registeredWebhooks.filter(webhook => webhook.url !== url);
  console.log(`Webhook unregistered: ${url}`);

  res.status(200).json({ message: 'Webhook unregistered successfully' });
});

app.get('/registered-webhooks', (req, res) => {
  res.status(200).json({
    webhooks: registeredWebhooks
  });
});

// Send Notification Endpoint
app.post('/send-notification', (req, res) => {
  const { message } = req.body;

  // Validate input
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Send notifications to all registered webhooks
  registeredWebhooks.forEach(({ url }) => {
    console.log(`Sending notification to: ${url}`);
    // Logic to send HTTP POST request to each webhook URL
  });

  res.status(200).json({ message: 'Notification sent to all registered webhooks' });
});

// Ping Endpoint
app.get('/ping', async (req, res) => {
  const testPayload = req.query.testPayload || "Default Ping Payload";

  // Use fetch from node (Node.js 18+) or require('node-fetch') for older versions
  const fetch = global.fetch || (await import('node-fetch')).default;

  // Send POST request to each webhook URL for each event (or at least once if no events)
  const results = await Promise.allSettled(
    registeredWebhooks.flatMap(({ url, events }) => {
      // If events is a non-empty array, send for each event; otherwise, send once with event: null
      if (Array.isArray(events) && events.length > 0) {
        return events.map(async (event) => {
          try {
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ping: testPayload, event }),
            });
            return { url, event, status: response.status };
          } catch (error) {
            return { url, event, error: error.message };
          }
        });
      } else {
        // No events, just send once
        return [
          (async () => {
            try {
              const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ping: testPayload }),
              });
              return { url, event: null, status: response.status };
            } catch (error) {
              return { url, event: null, error: error.message };
            }
          })()
        ];
      }
    })
  );

  res.status(200).json({
    message: `Ping sent to all registered webhooks for all events with payload: ${testPayload}`,
    results,
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Exposee server running on http://localhost:${PORT}`);
});
