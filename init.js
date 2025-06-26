const mongoose=require('mongoose')
const data=require('./data.js')
const listing =require('./models/schema.js')

main().then((res)=>{
    console.log('connected');
}).catch((e)=>console.log(e));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonder');
}


const initDb = async () => {
    try {
        await listing.deleteMany({});
        data.data=data.data.map((obj)=>({
            ...obj,owner:'685b8c9a215eba2ea64c1266'
        }))
        await listing.insertMany(data.data);
        console.log('Database initialized with sample data');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

initDb();