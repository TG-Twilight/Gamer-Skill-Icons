"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const routes_1 = __importDefault(require("./routes"));
const api = (0, express_1.default)();
api.use(express_1.default.json());
api.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "blob:", "*"],
            connectSrc: ["'self'", "*"]
        }
    }
}));
api.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
}));
api.use((0, morgan_1.default)("tiny"));
api.get("/", async (_req, res) => {
    try {
        const iconsDir = path_1.default.join(__dirname, "../icons");
        const files = await promises_1.default.readdir(iconsDir);
        const svgs = files.filter(file => file.endsWith(".svg"));
        const totalIcons = svgs.length;
        res.status(200).json({
            status: res.statusCode,
            message: "Total Icons → " + totalIcons,
            github: "你看起来没有调用任何图标，请访问：https://github.com/TG-Twilight/Gamer-Skill-Icons"
        });
    }
    catch (error) {
        res.status(500).json({
            status: res.statusCode,
            message: "Internal Server Error!"
        });
    }
});
api.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    if (_req.path.endsWith(".svg")) {
        res.header("Content-Type", "image/svg+xml");
        res.header("Content-Security-Policy", "default-src 'self' data: 'unsafe-inline'");
    }
    next();
});
api.use("/api", routes_1.default);
api.use((_req, res) => {
    res.status(404).json({
        status: res.statusCode,
        message: "Not Found!",
        hint: "Hmm... There's no such route."
    });
});
api.listen(3000, () => console.log("→ Listening..."));
exports.default = api;
