export const generateSVG = (icons: string[], perLine: number = 15) => {
    const ICON_SIZE = 256; // 你的主图标尺寸，如果都是350就用350
    const GAP = 44.25;     // 原项目的间距
    const cols = Math.min(perLine, icons.length);
    const rows = Math.ceil(icons.length / perLine);
    const width = cols * ICON_SIZE + (cols - 1) * GAP;
    const height = rows * ICON_SIZE;

    // 提取整个 <svg ...>...</svg> 块
    const extractSVG = (svg: string) => {
        const match = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
        const viewBoxMatch = svg.match(/viewBox="([^"]+)"/i);
        const viewBox = viewBoxMatch ? viewBoxMatch[1] : `0 0 ${ICON_SIZE} ${ICON_SIZE}`;
        // 保留原始svg的viewBox和内容
        return {
            svgContent: match ? match[0] : svg,
            viewBox,
        };
    };

    const iconGroup = icons.map((svg, index) => {
        const col = index % perLine;
        const row = Math.floor(index / perLine);
        const x = col * (ICON_SIZE + GAP);
        const y = row * ICON_SIZE;
        // 拼接时包一层<g>定位，里面仍然是完整<svg ...>...</svg>
        const { svgContent } = extractSVG(svg);
        // 替换svg的width/height属性以适配主SVG的格子
        const fixedSVG = svgContent
            .replace(/<svg([^>]*)width="[^"]*"([^>]*)/i, `<svg$1width="${ICON_SIZE}"$2`)
            .replace(/<svg([^>]*)height="[^"]*"([^>]*)/i, `<svg$1height="${ICON_SIZE}"$2`);
        return `<g transform="translate(${x}, ${y})">${fixedSVG}</g>`;
    }).join('\n');

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
        fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
        <defs></defs>
        ${iconGroup}
    </svg>`;
};
