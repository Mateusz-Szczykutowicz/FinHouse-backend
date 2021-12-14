"use strict";
import app from "./app";
import config from "./config";

app.listen(config.PORT, () => {
    console.log("Server listening on PORT: " + config.PORT);
});

export default app;
