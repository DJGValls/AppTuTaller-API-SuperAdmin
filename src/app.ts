import app from "server/server.ts";
import dotenv from "dotenv";
import "config/mongodb";
import { createInitialSetup } from "config/initSetup";

dotenv.config();

const PORT = process.env.PORT || 4000;

// Para iniciar unos usuarios de tipo admin, manager y user si la db esta vacia 
createInitialSetup();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
