import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import swaggerUi from 'swagger-ui-express';
import swaggerDocs from 'swagger-jsdoc'

// Routes import here
import userRouter from './routes/user_routes';
import bukaRoutes from './routes/buka_owner_routes';
import cuisineRoutes from './routes/cuisine_routes';
import orderRoutes from './routes/order_routes';
import reviewRoutes from './routes/review_routes';
import helpCenterRoutes from './routes/help_center_routes';
import adminRoutes from './routes/admin_routes';
import getUserRole from './routes/user_routes';
import webhookRoute from './routes/webhook_route'

const app = express();

// ============= Webhook Route 
// app.use("/api", webhookRoute);

//============= Middlewares
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173","https://buka-street-gkz2.vercel.app", "https://buka-street.vercel.app"],
  })
);
app.use(morgan('dev'));
app.use(cookieParser());

//============= test Route for server
app.get('/', (req, res) => {
  res.send('Welcome to the Buka Store API!');
});


//============= Routes
app.use('/api/users', userRouter);
app.use('/api/bukas', bukaRoutes);
app.use('/api/cuisines', cuisineRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/help_center', helpCenterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/users", getUserRole);

app.use("/api", webhookRoute);

//============= Swagger UI Docs
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Buka Store API',
      version: '1.0.0',
      description: 'An API for a buka store application where users can order food from different buka owners and also manage their orders.',
      contact: {
        name: 'Developer Name',
        url: 'Developer URL here',
        email: 'Developer email here',
      },
    },
    servers: [
      {
        url: 'buka-street.vercel.app/',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.ts'],
};

const specs = swaggerDocs(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//============= Server
const PORT = process.env.PORT || 8000;
const CONNECTION_URI = process.env.MONGO_URI || '';

mongoose.set('strictQuery', false);
mongoose
  .connect(CONNECTION_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((error: any) => {
    console.log(error);
  });

  //export default app;