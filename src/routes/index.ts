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

// 仅清理 SVG 文件头部的杂质，不移除图形内容
function cleanSVG(svg: string): string {
    return svg
        .replace(/<\?xml[\s\S]*?\?>\s*/g, '')
        .replace(/<!DOCTYPE[\s\S]*?\]>\s*/g, '')
        .replace(/<!DOCTYPE[\s\S]*?>\s*/g, '')
        .replace(/<metadata[\s\S]*?<\/metadata>\s*/gi, '')
        .replace(/<switch[\s\S]*?<\/switch>\s*/gi, '')
        .replace(/<foreignObject[\s\S]*?<\/foreignObject>\s*/gi, '')
        .replace(/<!ENTITY[\s\S]*?>\s*/g, '')
        .replace(/xmlns:[a-zA-Z0-9]+="&[a-zA-Z0-9_]+;"/g, '')
        .replace(/<i:[^>]+>[\s\S]*?<\/i:[^>]+>/g, '')
        .replace(/<i:[^/>]+\/>/g, '')
        .replace(/ i:[a-zA-Z0-9:-]+="[^"]*"/g, '')
        .replace(/ i:[a-zA-Z0-9:-]+='[^']*'/g, '')
        .replace(/ i:[a-zA-Z0-9:-]+\b/g, '')
        .replace(/^\uFEFF/, '')
        .replace(/^\s+/, '');
}

// 只去掉 <svg ...> 和 </svg>，保留内容
function extractSvgContent(svg: string): string {
    return svg.replace(/^<svg[^>]*?>/i, '').replace(/<\/svg>\s*$/i, '');
}

router.get("/icons", async (req: Request, res: Response) => {
    const { i, perline, radius = "25" } = req.query;
    const iconsDir = path.join(__dirname, "../../icons");
    if (i && typeof i === "string") {
        const iconsList = i.split(",");
        const icons: string[] = [];
        for (const icon of iconsList) {
            const iconPath = path.join(iconsDir, `${icon.trim()}.svg`);
            try {
                let content = await fs.readFile(iconPath, "utf-8");
                content = cleanSVG(content);

                // 仅为调试：打印内容确认中间没被清空
                console.log("=== 清洗后SVG内容 ===\n", content);

                icons.push(content);
            } catch (error) {
                console.error(`Icon isn't valid → ${iconPath}`, error);
            }
        }
        if (icons.length === 0) {
            return res.status(404).json({ message: "No valid icon." });
        } else if (icons.length === 1) {
            res.setHeader("Content-Type", "image/svg+xml");
            return res.status(200).send(icons[0]);
        } else {
            // 多个SVG拼接
            const groupWidth = 300, groupHeight = 256;
            let svgGroups = '';
            for (let i = 0; i < icons.length; i++) {
                const x = i * groupWidth;
                svgGroups += `<g transform="translate(${x}, 0)">\n${extractSvgContent(icons[i])}\n</g>\n`;
            }
            const width = groupWidth * icons.length;
            const height = groupHeight;
            const response = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">\n${svgGroups}</svg>`;
            res.setHeader("Content-Type", "image/svg+xml");
            return res.status(200).send(response);
        }
    } else {
        // 列出所有图标
        try {
            const files = await fs.readdir(iconsDir);
            const icons = files.filter(file => file.endsWith(".svg")).map(file => path.basename(file, ".svg"));
            return res.status(200).json({ icons });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error!" });
        }
    }
});

export default router;
