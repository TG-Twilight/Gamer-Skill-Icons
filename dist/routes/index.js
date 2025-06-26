"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const utils_1 = require("../utils");
const shortNames_1 = __importDefault(require("./r6x/shortNames"));
const router = express_1.default.Router();
// 自动生成 shortNamesReverse
const shortNamesReverse = {};
Object.entries(shortNames_1.default).forEach(([short, full]) => {
    if (!shortNamesReverse[full]) {
        shortNamesReverse[full] = [];
    }
    shortNamesReverse[full].push(short);
});
router.get("/icons", async (req, res) => {
    const { i, perline, radius = "25" } = req.query;
    const iconsDir = path_1.default.join(__dirname, "../../icons");
    const minRadius = 0;
    const maxRadius = 100;
    if (i && typeof i === "string") {
        const iconsList = i.split(",");
        const fullIconsList = iconsList.map(icon => shortNames_1.default[icon.trim()] || icon.trim());
        const icons = [];
        for (const icon of fullIconsList) {
            const iconPath = path_1.default.join(iconsDir, `${icon.trim()}.svg`);
            try {
                let content = await promises_1.default.readFile(iconPath, "utf-8");
                let radiusValue = Number(radius);
                if (isNaN(radiusValue) || radiusValue < minRadius) {
                    radiusValue = minRadius;
                }
                else if (radiusValue > maxRadius) {
                    radiusValue = maxRadius;
                }
                // 可选：仅在你的 SVG 的确存在 <rect ...rx="..."> 时才替换
                content = content.replace(/<rect([^>]*)rx="(\d+)"/, (match, before) => {
                    return `<rect${before}rx="${radiusValue}"`;
                });
                icons.push(content);
            }
            catch (error) {
                console.error(`Icon isn't valid → ${icon}`);
            }
        }
        if (icons.length === 0) {
            return res.status(404).json({
                status: res.statusCode,
                message: "Not Found!",
                hint: "Hmm... There's no valid icon."
            });
        }
        // 统一拼接输出，无论单个还是多个
        let response;
        if (perline !== undefined) {
            const perlineNumber = Number(perline);
            if (!isNaN(perlineNumber) && perlineNumber > 0 && perlineNumber <= 15) {
                response = (0, utils_1.generateSVG)(icons, perlineNumber);
            }
            else {
                response = (0, utils_1.generateSVG)(icons);
            }
        }
        else {
            response = (0, utils_1.generateSVG)(icons);
        }
        res.setHeader("Content-Type", "image/svg+xml");
        return res.status(200).send(response);
    }
    else {
        // 列出所有图标部分
        try {
            const files = await promises_1.default.readdir(iconsDir);
            const icons = files
                .filter(file => file.endsWith(".svg"))
                .map(file => path_1.default.basename(file, ".svg"));
            return res.status(200).json({
                status: res.statusCode,
                icons
            });
        }
        catch (error) {
            res.status(500).json({
                status: res.statusCode,
                message: "Internal Server Error!"
            });
        }
    }
});
router.get("/readme", async (_req, res) => {
    const iconsDir = path_1.default.join(__dirname, "../../icons");
    try {
        const files = await promises_1.default.readdir(iconsDir);
        const svgs = files.filter(file => file.endsWith(".svg"));
        const totalIcons = svgs.length;
        const halfTotal = Math.ceil(totalIcons / 2);
        const firstHalf = svgs.slice(0, halfTotal);
        const secondHalf = svgs.slice(halfTotal);
        let table = "| ID | Icon | Alias | ID | Icon | Alias |\n";
        table += "|----|------|-------|----|------|-------|\n";
        for (let i = 0; i < halfTotal; i++) {
            const leftSide = firstHalf[i];
            const rightSide = secondHalf[i];
            const leftId = leftSide.replace(".svg", "");
            const leftAlias = shortNamesReverse[leftId] ?
                `\`${shortNamesReverse[leftId].join(", ")}\`` : "-";
            let row = `| \`${leftId}\` | <img src="./icons/${leftId}.svg" width="48" /> | ${leftAlias}`;
            if (rightSide) {
                const rightId = rightSide.replace(".svg", "");
                const rightAlias = shortNamesReverse[rightId] ?
                    `\`${shortNamesReverse[rightId].join(", ")}\`` : "-";
                row += ` | \`${rightId}\` | <img src="./icons/${rightId}.svg" width="48" /> | ${rightAlias}`;
            }
            else {
                row += ` | | | `;
            }
            table += row + "|\n";
        }
        res.setHeader("Content-Type", "text/markdown");
        return res.status(200).send(table);
    }
    catch (error) {
        res.status(500).json({
            status: res.statusCode,
            message: "Internal Server Error!"
        });
    }
});
exports.default = router;
