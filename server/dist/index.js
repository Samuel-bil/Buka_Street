"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
// Routes import here
const user_routes_1 = __importDefault(require("./routes/user_routes"));
const buka_owner_routes_1 = __importDefault(require("./routes/buka_owner_routes"));
const cuisine_routes_1 = __importDefault(require("./routes/cuisine_routes"));
const order_routes_1 = __importDefault(require("./routes/order_routes"));
const review_routes_1 = __importDefault(require("./routes/review_routes"));
const help_center_routes_1 = __importDefault(require("./routes/help_center_routes"));
const admin_routes_1 = __importDefault(require("./routes/admin_routes"));
const user_routes_2 = __importDefault(require("./routes/user_routes"));
const webhook_route_1 = __importDefault(require("./routes/webhook_route"));
const app = (0, express_1.default)();
// ============= Webhook Route 
app.use("/api", webhook_route_1.default);
//============= Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: ["http://localhost:5173", "https://buka-street-gkz2.vercel.app", "https://buka-street.vercel.app"],
}));
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
//============= test Route for server
app.get('/', (req, res) => {
    res.send('Welcome to the Buka Store API!');
});
//============= Routes
app.use('/api/users', user_routes_1.default);
app.use('/api/bukas', buka_owner_routes_1.default);
app.use('/api/cuisines', cuisine_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/review', review_routes_1.default);
app.use('/api/help_center', help_center_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use("/api/users", user_routes_2.default);
//============= Swagger UI Docs
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Buka Store API',
            version: '1.0.0',
            description: 'An API for a buka store application where users can order food from different buka owners and also manage their orders.',
            contact: {
                name: 'Developer Name',
                url: 'Developer URL here',
                email: 'Developer email here',
            },
        },
        servers: [
            {
                url: 'buka-street.vercel.app/',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.ts'],
};
const specs = (0, swagger_jsdoc_1.default)(options);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
//============= Server
const PORT = process.env.PORT || 8000;
const CONNECTION_URI = process.env.MONGO_URI || '';
mongoose_1.default.set('strictQuery', false);
mongoose_1.default
    .connect(CONNECTION_URI)
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.log(error);
});
