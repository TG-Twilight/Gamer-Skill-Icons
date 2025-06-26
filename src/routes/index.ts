import express from "express";
import type { Router, Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import { generateSVG } from "../utils";

const router: Router = express.Router();

/** 动态获取所有游戏名（即 icons 目录下的所有文件夹） */
async function getAllGames(): Promise<string[]> {
    const iconsBaseDir = path.join(__dirname, "../../icons");
    const entries = await fs.readdir(iconsBaseDir, { withFileTypes: true });
    return entries.filter(e => e.isDirectory()).map(e => e.name);
}

/** 动态加载别名映射 shortNames */
async function getShortNames(game: string): Promise<Record<string, string>> {
    try {
        // 注意路径需要兼容 ESModule/CommonJS，根据你的 tsconfig/module 设置
        const mod = await import(`./${game}/shortNames`);
        return mod.default || {};
    } catch (err) {
        // 没有对应 shortNames 文件就返回空对象
        return {};
    }
}

/** 动态生成 shortNamesReverse */
function getShortNamesReverse(shortNames: Record<string, string>): Record<string, string[]> {
    const shortNamesReverse: Record<string, string[]> = {};
    Object.entries(shortNames).forEach(([short, full]) => {
        if (!shortNamesReverse[full]) {
            shortNamesReverse[full] = [];
        }
        shortNamesReverse[full].push(short);
    });
    return shortNamesReverse;
}

// /games  列举所有游戏
router.get("/games", async (_req, res) => {
    const games = await getAllGames();
    res.json({ games });
});

// /icons?game=R6X&i=xxx,yyy
router.get("/icons", async (req: Request, res: Response) => {
    const { i, perline, radius = "25", game } = req.query;
    const games = await getAllGames();
    const gameStr = typeof game === "string" && games.includes(game) ? game : games[0]; // 默认第一个游戏
    const iconsDir = path.join(__dirname, "../../icons", gameStr);

    const minRadius = 0;
    const maxRadius = 100;

    const shortNames = await getShortNames(gameStr);

    if (i && typeof i === "string") {
        const iconsList = i.split(",");
        const fullIconsList = iconsList.map(icon => shortNames[icon.trim()] || icon.trim());
        const icons: string[] = [];
        for (const icon of fullIconsList) {
            const iconPath = path.join(iconsDir, `${icon.trim()}.svg`);
            try {
                let content = await fs.readFile(iconPath, "utf-8");
                let radiusValue = Number(radius);
                if (isNaN(radiusValue) || radiusValue < minRadius) {
                    radiusValue = minRadius;
                } else if (radiusValue > maxRadius) {
                    radiusValue = maxRadius;
                }
                content = content.replace(/<rect([^>]*)rx="(\d+)"/, (match, before) => {
                    return `<rect${before}rx="${radiusValue}"`;
                });
                icons.push(content);
            } catch (error) {
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
        let response;
        if (perline !== undefined) {
            const perlineNumber = Number(perline);
            if (!isNaN(perlineNumber) && perlineNumber > 0 && perlineNumber <= 15) {
                response = generateSVG(icons, perlineNumber);
            } else {
                response = generateSVG(icons);
            }
        } else {
            response = generateSVG(icons);
        }
        res.setHeader("Content-Type", "image/svg+xml");
        return res.status(200).send(response);
    } else {
        try {
            const files = await fs.readdir(iconsDir);
            const icons = files
                .filter(file => file.endsWith(".svg"))
                .map(file => path.basename(file, ".svg"));

            return res.status(200).json({
                status: res.statusCode,
                icons
            });
        } catch (error) {
            res.status(500).json({
                status: res.statusCode,
                message: "Internal Server Error!"
            });
        }
    }
});

// /readme?game=R6X
router.get("/readme", async (req: Request, res: Response) => {
    const { game } = req.query;
    const games = await getAllGames();
    const gameStr = typeof game === "string" && games.includes(game) ? game : games[0];
    const iconsDir = path.join(__dirname, "../../icons", gameStr);
    const shortNames = await getShortNames(gameStr);
    const shortNamesReverse = getShortNamesReverse(shortNames);

    try {
        const files = await fs.readdir(iconsDir);
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
            let row = `| \`${leftId}\` | <img src="./icons/${gameStr}/${leftId}.svg" width="48" /> | ${leftAlias}`;

            if (rightSide) {
                const rightId = rightSide.replace(".svg", "");
                const rightAlias = shortNamesReverse[rightId] ?
                    `\`${shortNamesReverse[rightId].join(", ")}\`` : "-";
                row += ` | \`${rightId}\` | <img src="./icons/${gameStr}/${rightId}.svg" width="48" /> | ${rightAlias}`;
            } else {
                row += ` | | | `;
            }

            table += row + "|\n";
        }

        res.setHeader("Content-Type", "text/markdown");
        return res.status(200).send(table);
    } catch (error) {
        res.status(500).json({
            status: res.statusCode,
            message: "Internal Server Error!"
        });
    }
});

export default router;
