const swaggerAutogen = require('swagger-autogen')();

// No `host` set on purpose: Swagger UI then targets whatever origin is
// serving the page, so the same generated file works on localhost and
// on the deployed Render URL without regenerating per environment.
const doc = {
  info: {
    title: 'Contacts API',
    description: 'API for storing and retrieving contact information (CSE 341 project).',
  },
  schemes: ['http', 'https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
