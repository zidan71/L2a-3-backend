"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const port = 5000;
app_1.default.get('/', (req, res) => {
    res.send('server is running smoothly');
});
mongoose_1.default.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ytuhl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
    console.log('MongoDB connected');
    app_1.default.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
});
