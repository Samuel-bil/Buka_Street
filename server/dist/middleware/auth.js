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
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_SECRET;
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // If system doesn't support cookies, use authorization header
    const cookieToken = req.cookies.token;
    const requestToken = cookieToken || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
    if (requestToken) {
        try {
            // Verify token and cast decoded payload to include id and role
            const decoded = jsonwebtoken_1.default.verify(requestToken, secretKey);
            // get user id from decoded token and Assign the id and role to req.user
            req.user = { id: decoded.id, role: decoded.role };
            // pass user to next middleware
            next();
        }
        catch (error) {
            console.error('Token Verification Error:', error);
            return res.status(401).json({ message: 'Unauthorized Access' });
        }
    }
    else {
        res.status(401).json({ message: 'Access denied, no token' });
    }
});
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        var _a;
        if (!roles.includes(((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || '')) {
            return res.status(403).json({ message: 'Unauthorized Access' });
        }
        next();
    };
};
exports.authorize = authorize;
