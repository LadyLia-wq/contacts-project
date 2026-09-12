require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const { initDb } = require('./db/connect');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Render sets RENDER_EXTERNAL_URL automatically; use it so "Try it out"
// in Swagger UI targets the deployed URL instead of localhost.
if (process.env.RENDER_EXTERNAL_URL) {
  swaggerDocument.host = new URL(process.env.RENDER_EXTERNAL_URL).host;
  swaggerDocument.schemes = ['https'];
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', require('./routes'));

initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
});
