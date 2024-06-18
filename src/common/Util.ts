import { toExit } from "../root.js";

/* Stops the server and exits Ink */
function exit(exit: () => void): void {
    // Safely exits ink
    exit();

    // Close down server
    toExit.close();
}

export default {
    exit,
};
