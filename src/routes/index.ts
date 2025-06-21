import express from "express";
import type { Router, Request, Response } from "express";
import path from "path";
import fs from "fs/promises";

import { generateSVG } from "../utils";

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
}

const shortNamesReverse: Record<string, string[]> = {};
Object.entries(shortNames).forEach(([short, full]) => {
    if (!shortNamesReverse[full]) {
        shortNamesReverse[full] = [];
    }
    shortNamesReverse[full].push(short);
});

router.get("/icons", async (req: Request, res: Response) => {
    const { i, perline, radius="25" } = req.query;
    const iconsDir = path.join(__dirname, "../../icons");
    const minRadius = 0
    const maxRadius = 100
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
                    radiusValue = minRadius
                } else if (radiusValue > maxRadius) {
                    radiusValue = maxRadius
                }
                content = content.replace(/<rect([^>]*)rx="(\d+)"/, (match, before) => {
                    return `<rect${before}rx="${radiusValue}"`
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
        } else {
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
        }
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
            const leftAlias = shortNamesReverse[leftId] ?
                `\`${shortNamesReverse[leftId].join(", ")}\`` : "-";
            let row = `| \`${leftId}\` | <img src="./icons/${leftId}.svg" width="48" /> | ${leftAlias}`;

            if (rightSide) {
                const rightId = rightSide.replace(".svg", "");
                const rightAlias = shortNamesReverse[rightId] ?
                    `\`${shortNamesReverse[rightId].join(", ")}\`` : "-";
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
