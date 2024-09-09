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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    BUKA: 'buka',
};
const UserSchema = new mongoose_1.default.Schema({
    first_name: {
        type: String,
        required: [true, 'Please enter your first name'],
        min: [3, 'Name must be at least 3 characters long'],
    },
    last_name: {
        type: String,
        required: [true, 'Please enter your last name'],
        min: [3, 'Name must be at least 3 characters long'],
    },
    email: {
        type: String,
        required: [true, 'Please enter an Email'],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            'Please enter a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        validate: {
            validator: function (value) {
                // Use a regular expression to check for the desired pattern
                const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
                return passwordPattern.test(value);
            },
            message: 'Password must contain at least one number, one uppercase letter, one lowercase letter, and be at least 8 characters long',
        },
    },
    image: {
        type: String,
    },
    phone: {
        type: String,
        default: '+44',
    },
    role: {
        type: String,
        enum: [ROLES.USER, ROLES.ADMIN, ROLES.BUKA], // define the roles as constants to avoid typos
        default: 'user',
    },
}, {
    timestamps: true,
});
// Hash the password before saving to database using the pre() hook method
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // function to hash the password before saving to database
        if (!this.isModified('password')) {
            return next(); // If the password is not modified, continue saving
        }
        try {
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashedPassword = yield bcryptjs_1.default.hash(this.get('password'), salt);
            this.set('password', hashedPassword);
            // Set a default image if none is provided
            if (!this.get('image')) {
                const firstNameInitial = this.get('first_name')[0];
                const defaultImageUrl = `https://ui-avatars.com/api/?name=${firstNameInitial}&background=random&color=fff`;
                this.set('image', defaultImageUrl);
            }
            return next(); // Call the next() function to continue saving
        }
        catch (error) {
            console.log(error); // Pass any error to the next middleware
        }
    });
});
exports.default = mongoose_1.default.model('User', UserSchema);
