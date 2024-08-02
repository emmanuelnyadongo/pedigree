import { createServer } from "./server";
import { createVerifyAuth } from "./middleware";
import { createLowdbSessions } from "./sessions";

const SESSION_DURATION = 3 * 60 * 60 * 1000;

createLowdbSessions(SESSION_DURATION)
  .then((sessions) => {
    const verifyAuth = createVerifyAuth(sessions);
    const env = process.env.NODE_ENV;

    createServer(sessions, verifyAuth, env).listen(5000, () =>
      console.log("Server running on port 5000")
    );
  })
  .catch((error) => {
    console.log(error);
  });
