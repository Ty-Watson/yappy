import mongoose from 'mongoose';

let isConnected = false; // track the connection

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if(isConnected) {
    console.log('db is already connected');
    return;
  }

  try {
    await mongoose.connect(process.env.UPSTASH_REDIS_REST_URL, {
      dbName: "chat-app",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    isConnected = true;

    console.log('db connected')
  } catch (error) {
    console.log(error);
  }
}