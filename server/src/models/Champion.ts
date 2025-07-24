import mongoose from 'mongoose';

const { Schema , model } = mongoose;

export const championSchema = new Schema({
   name: String,
   tier: {
    type: String,
    enum: ['S+', 'S','A+', 'A','B+','B','C+','C']
   }
})

const Champion = model('Champion', championSchema);
export default Champion;