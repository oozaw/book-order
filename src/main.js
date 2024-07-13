import {app} from "./config/app.js";
import {log} from "./config/log.js";

const port = process.env.PORT || 3000;

app.listen(port, () => {
   log.info(`Server started on port ${port}`);
});