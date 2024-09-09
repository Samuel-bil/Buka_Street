"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.sendMessage = void 0;
const help_center_model_1 = __importDefault(require("../models/help_center_model"));
// Controller to send a message
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { subject, message } = req.body;
        // Create a new help center message
        const helpCenterMessage = new help_center_model_1.default({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            subject,
            message,
        });
        yield helpCenterMessage.save();
        res.status(201).json({ message: 'Message sent successfully', helpCenterMessage });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to send message', error });
    }
});
exports.sendMessage = sendMessage;
// Controller to get all messages (for admin only)
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all help center messages
        const messages = yield help_center_model_1.default.find()
            .populate('user', 'first_name last_name email image')
            .exec();
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to retrieve messages', error });
    }
});
exports.getMessages = getMessages;
