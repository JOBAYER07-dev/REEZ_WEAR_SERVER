import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes'; 
const app = express();

app.set('trust proxy', true);

app.use(
  cors({
    origin: [
      'https://reez-wear.vercel.app',
      'https://reez-wear-git-main-jobayerhosen045-7207s-projects.vercel.app',
      'http://localhost:3000',
    ],
    credentials: true,
  }),
);

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); 
app.get('/', (req: Request, res: Response) => {
  res.send('REEZ server is running with TypeScript!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
