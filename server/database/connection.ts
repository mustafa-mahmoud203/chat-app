import mongoose from 'mongoose'

class DataBaseConnection {


    public async connectionDB(): Promise<any> {
        try {
            await mongoose.connect(process.env.DATABSE_CONNECTION_URL || "")
            console.log("database connected.......");


        } catch (err) {
            console.log(`fail to connect database........ ${err}`)
        }

    }
}

export default DataBaseConnection