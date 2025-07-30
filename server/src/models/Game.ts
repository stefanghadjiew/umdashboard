import mongoose from 'mongoose';
import { championSchema } from './Champion';

const { Schema , model } = mongoose;

  const teamPickSchema = new Schema({
    player: {
      type: String,
      required: true,
    },
    champions: {
      type: [championSchema],
      default: [],
    },
  }, { _id: false });


const gameSchema = new Schema({
    mode: {
        type: String,
        enum: ['1vs1', '2vs2'],
    },
    status: {
      type: String,
      enum: ['Active', 'Full', 'Finished']
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
    },
    championPool: {
      type: [championSchema],
      default: [],
    },
     currentPicks: {
      Team1: {
        type: [teamPickSchema],
        default: [],
      },
      Team2: {
        type: [teamPickSchema],
        default: [],
      },
      default: []
  },
  finalPicks: {
    Team1: {
      type: [teamPickSchema],
      default: [],
    },
    Team2: {
      type: [teamPickSchema],
      default: [],
    },
    default: []
  }
})

const Game = model('Game', gameSchema);
export default Game;