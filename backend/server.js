import express from 'express'
import {env} from './config/env.js';

const app = express();

app.use(express.json());

app.listen(5000, () => {
    console.log(`Server is running on PORT 5000`);
});