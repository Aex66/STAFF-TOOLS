import { Database } from "./Database.js";
import { EventEmitter } from "./EventEmitter.js";
class ScriptConstructor extends EventEmitter {
    constructor() {
        super(...arguments);
        this.kits = new Database('KITS');
    }
}
const Script = new ScriptConstructor();
export default Script;
