import mongoose from 'mongoose'


const Schema = mongoose.Schema;


const CafeSchema = new Schema({
    
    
    comments: Array,
    name: String,

})

const Cafes = mongoose.model('Cafes', CafeSchema)

export default Cafes








