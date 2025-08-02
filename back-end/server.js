const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// REST API Routes
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));

// GraphQL Endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true
}));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
