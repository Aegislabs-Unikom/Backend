import server from "./server";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
dotenv.config();
const port = process.env.PORT || 5000;


AppDataSource.initialize()
  .then(async () => {
    console.log("Connection initialized with database...");
  })
  .catch((error) => console.log(error));


server.listen(port,()=>{
  console.log(`[Server] Listening on http://localhost:${port}` );
})