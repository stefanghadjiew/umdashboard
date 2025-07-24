import Game from '../models/Game';
import Champion from '../models/Champion';
import { connectDB } from './connectDB'; 

  connectDB();

  export  { Game, Champion};