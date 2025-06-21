import express from "express";
import type { Router, Request, Response } from "express";
import path from "path";
import fs from "fs/promises";

const router: Router = express.Router();

const shortNames: Record<string, string> = {
    "ace": "ace",
    "alibi": "alibi",
    "amaru": "amaru",
    "aruni": "aruni",
    "ash": "ash",
    "azami": "azami",
    "bandit": "bandit",
    "blackbeard": "blackbeard",
    "blitz": "blitz",
    "brava": "brava",
    "buck": "buck",
    "capitao": "capitao",
    "castle": "castle",
    "caveira": "caveira",
    "clash": "clash",
    "deimos": "deimos",
    "doc": "doc",
    "dokkaebi": "dokkaebi",
    "echo": "echo",
    "ela": "ela",
    "fenrir": "fenrir",
    "finka": "finka",
    "flores": "flores",
    "frost": "frost",
    "fuze": "fuze",
    "glaz": "glaz",
    "goyo": "goyo",
    "gridlock": "gridlock",
    "grim": "grim",
    "hibana": "hibana",
    "iana": "iana",
    "iq": "iq",
    "jackal": "jackal",
    "jager": "jager",
    "kaid": "kaid",
    "kali": "kali",
    "kapkan": "kapkan",
    "lesion": "lesion",
    "lion": "lion",
    "maestro": "maestro",
    "maverick": "maverick",
    "melusi": "melusi",
    "mira": "mira",
    "montagne": "montagne",
    "mozzie": "mozzie",
    "mute": "mute",
    "nokk": "nokk",
    "nomad": "nomad",
    "oryx": "oryx",
    "osa": "osa",
    "pulse": "pulse",
    "ram": "ram",
    "rauora": "rauora",
    "recruit_blue": "recruit_blue",
    "recruit_green": "recruit_green",
    "recruit_orange": "recruit_orange",
    "recruit_red": "recruit_red",
    "recruit_yellow": "recruit_yellow",
    "rook": "rook",
    "sens": "sens",
    "sentry": "sentry",
    "skopos": "skopos",
    "sledge": "sledge",
    "smoke": "smoke",
    "solis": "solis",
    "striker": "striker",
    "tachanka": "tachanka",
    "thatcher": "thatcher",
    "thermite": "thermite",
    "thorn": "thorn",
    "thunderbird": "thunderbird",
    "tubarao": "tubarao",
    "twitch": "twitch",
    "valkyrie": "valkyrie",
    "vigil": "vigil",
    "wamai": "wamai",
    "warden": "warden",
    "ying": "ying",
    "zero": "zero",
    "zofia": "zofia",
};

const shortNamesReverse: Record<string, string[]> = {};
Object.entries(shortNames).forEach(([short, full]) => {
    if (!shortNamesReverse[full]) {
        shortNamesReverse[full] = [];
    }
    shortNamesReverse[full].push(short);
});

// 清理SVG头部杂质，不动任何 <g> <rect> <path> <switch>...
function cleanSVG(svg: string): string {
    return svg
        .replace(/<\?xml[\s\S]*?\?>\s*/g, '')
        .replace(/<!DOCTYPE[\s\S]*?\]?>\s*/g, '')
        .replace(/<!ENTITY[\s\S]*?>\s*/g, '')
        .replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
        .replace(/<i:aipgf[\s\S]*?<\/i:aipgf>/gi, '')
        .replace(/<i:aipgfRef[^>]*\/>/gi, '')
        .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
        .replace(/xmlns:[a-zA-Z0-9]+="&[a-zA-Z0-9_]+;"/g, '')
        .replace(/xmlns:(x|i|graph)="[^"]*"/g, '')
        .replace(/i:[a-zA-Z0-9:-]+="[^"]*"/g, '')
        .replace(/^\uFEFF/, '')
        .replace(/^\s+/, '');
}

// 只去掉 <svg ...> 和 </svg> 标签本身，保留里面的内容
function extractSvgContent(svg: string): string {
    return svg.replace(/^<svg[^>]*?>/i, '').replace(/<\/svg>\s*$/i, '');
}

// 拼接多个SVG图标为一个大SVG（不嵌套svg，只拼内容）
function generateSVG(icons: string[], perline = 0) {
    const groupWidth = 300;
    const groupHeight = 256;
    let svgGroups = '';
    if (perline && perline > 0) {
        for (let i = 0; i < icons.length; i++) {
            const x = (i % perline) * groupWidth;
            const y = Math.floor(i / perline) * groupHeight;
            svgGroups += `<g transform="translate(${x}, ${y})">\n${extractSvgContent(icons[i])}\n</g>\n`;
        }
    } else {
        for (let i = 0; i < icons.length; i++) {
            const x = i * groupWidth;
            svgGroups += `<g transform="translate(${x}, 0)">\n${extractSvgContent(icons[i])}\n</g>\n`;
        }
    }
    const width = perline && perline > 0 ? groupWidth * Math.min(perline, icons.length) : groupWidth * icons.length;
    const height = perline && perline > 0 ? groupHeight * Math.ceil(icons.length / perline) : groupHeight;
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">\n${svgGroups}</svg>`;
}

router.get("/icons", async (req: Request, res: Response) => {
    const { i, perline, radius = "25" } = req.query;
    const iconsDir = path.join(__dirname, "../../icons");
    const minRadius = 0;
    const maxRadius = 100;
    if (i && typeof i === "string") {
        const iconsList = i.split(",");
        const fullIconsList = iconsList.map(icon => shortNames[icon.trim()] || icon.trim());
        const icons: string[] = [];
        for (const icon of fullIconsList) {
            const iconPath = path.join(iconsDir, `${icon.trim()}.svg`);
            try {
                let content = await fs.readFile(iconPath, "utf-8");
                content = cleanSVG(content);
                let radiusValue = Number(radius);
                if (isNaN(radiusValue) || radiusValue < minRadius) {
                    radiusValue = minRadius;
                } else if (radiusValue > maxRadius) {
                    radiusValue = maxRadius;
                }
                // 替换 <rect ... rx="xxx"...>
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
        } else if (icons.length === 1) {
            // 单个图标，直接返回SVG
            res.setHeader("Content-Type", "image/svg+xml");
            // 只返回清洗后的原SVG
            return res.status(200).send(cleanSVG(icons[0]));
        } else {
            // 多个图标拼为一个SVG（不嵌套svg，只拼内容）
            let response: string;
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
        }
    } else {
        // 不带参数，列出所有图标
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

router.get("/readme", async (_req: Request, res: Response) => {
    const iconsDir = path.join(__dirname, "../../icons");
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
            const leftAlias = shortNamesReverse[leftId]
                ? `\`${shortNamesReverse[leftId].join(", ")}\`` : "-";
            let row = `| \`${leftId}\` | <img src="./icons/${leftId}.svg" width="48" /> | ${leftAlias}`;

            if (rightSide) {
                const rightId = rightSide.replace(".svg", "");
                const rightAlias = shortNamesReverse[rightId]
                    ? `\`${shortNamesReverse[rightId].join(", ")}\`` : "-";
                row += ` | \`${rightId}\` | <img src="./icons/${rightId}.svg" width="48" /> | ${rightAlias}`;
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
