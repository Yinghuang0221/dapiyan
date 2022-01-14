import mongoose from 'mongoose'


const Schema = mongoose.Schema;


const CafeSchema = new Schema({
    
    Name: String,
    Description: String,
    Rating: String,

})

const Cafe = mongoose.model('Cafe', CafeSchema)

export default Cafe








