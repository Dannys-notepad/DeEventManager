const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'De Event Manager',
      version: '1.0.0',
      description: 'An Headless Backend',
    },
    servers: [
      {
        url: 'http://localhost:3000', // your server URL
      },
    ],
  },
  apis: ['./src/modules/**/**.route.js'], // path to your route files with Swagger comments
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;

