import { Database } from "./Database.js";
import { EventEmitter } from "./EventEmitter.js";

class ScriptConstructor extends EventEmitter {
    public kits: Database = new Database('KITS')
}

const Script = new ScriptConstructor()
export default Script