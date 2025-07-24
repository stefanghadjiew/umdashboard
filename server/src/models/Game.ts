import mongoose from 'mongoose';
import { championSchema } from './Champion';

const { Schema , model } = mongoose;


const gameSchema = new Schema({
    mode: {
        type: String,
        enum: ['1vs1', '2vs2'],
    },
    players: [
        {
            name: {
                type: String,
            },
            team: {
                type: String,
            }
        }
    ],
    createdBy: {
        type: String
    },
    winner: {
        type: String,
        enum: ['Team1','Team2']
    },
    picks: {
    Team1: {
      type: [championSchema],
      default: [],
    },
    Team2: {
      type: [championSchema],
      default: [],
    },
  },
  pickedBy: [
      {
        name: String,
        champions: {
          type: [championSchema],
          default: [],
        },
      },
    ],
    excludedTiers: {
        type: [String],
        enum: ['S+', 'S', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D+'],
        default: [],
    },
    bannedChampions: {
      type: [String],
      default: []
    }
})

const Game = model('Game', gameSchema);
export default Game;