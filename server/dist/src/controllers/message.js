var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { messageModel } from "../../database/models/message.model.js";
class MessageController {
    SaveMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const room = yield messageModel.create(data);
                return room;
            }
            catch (err) {
                console.log(`Failed to save message: ${err}`);
                throw new Error(`Failed to save message: ${err}`);
            }
        });
    }
    messages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield messageModel.find({});
                return messages;
            }
            catch (err) {
                console.log(`Failed to retrieve messages: ${err}`);
                throw new Error(`Failed to retrieve messages: ${err}`);
            }
        });
    }
}
export default MessageController;
