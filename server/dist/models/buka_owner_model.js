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
const BukaSchema = new mongoose_1.default.Schema({
    buka_name: {
        type: String,
        required: [true, 'Please enter the name of the buka'],
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
    },
    image: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2024/02/05/16/07/gas-8554849_1280.jpg',
    },
    phone: {
        type: String,
        default: '+44',
    },
    address: {
        type: String,
        default: 'No address provided',
    },
    postcode: {
        type: String,
        default: 'No postcode provided',
    },
    pre_order: {
        type: Boolean,
        default: false,
    },
    go_live: {
        type: Boolean,
        default: false,
    },
    opening_hours: [
        {
            day: String,
            openingTime: String,
            closingTime: String,
        },
    ],
    reviews: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
    role: {
        type: String,
        default: 'buka',
    },
}, {
    timestamps: true,
});
// Hash the password before saving to database using the pre() hook method
BukaSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // function to hash the password before saving to database
        if (!this.isModified('password')) {
            return next(); // If the password is not modified, continue saving
        }
        try {
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashedPassword = yield bcryptjs_1.default.hash(this.get('password'), salt);
            this.set('password', hashedPassword);
            return next(); // Call the next() function to continue saving
        }
        catch (error) {
            console.log(error); // Pass any error to the next middleware
        }
    });
});
exports.default = mongoose_1.default.model('Buka', BukaSchema);
