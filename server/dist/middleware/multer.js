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
const cloudinary_1 = __importDefault(require("cloudinary"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Configure Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Set up Multer to use Cloudinary storage
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default.v2,
    params: {
        folder: 'uploads',
        // format: async (req: any, file: any) => 'png', 
        format: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
            // Determine the file format based on the file extension
            const ext = path_1.default.extname(file.originalname).toLowerCase();
            if (['.png', '.jpg', '.jpeg'].includes(ext)) {
                return ext.substring(1); // Remove the dot
            }
            return 'png'; // Default format if none of the above
        }),
        public_id: (req, file) => `${Date.now()}_${file.originalname}`,
    }, // Type assertion here
});
const upload = (0, multer_1.default)({ storage: storage });
exports.default = upload;
