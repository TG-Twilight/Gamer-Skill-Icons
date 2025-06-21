function parseViewBox(svg: string): [number, number, number, number] {
    const match = svg.match(/viewBox="([\d.\s-]+)"/);
    if (!match) return [0, 0, 350, 350]; // 默认
    const parts = match[1].split(/\s+/).map(Number);
    while (parts.length < 4) parts.push(0);
    return parts as [number, number, number, number];
}

export const generateSVG = (icons: string[], perLine: number = 15) => {
    const ICON_SIZE = 350;
    const cols = Math.min(perLine, icons.length);
    const rows = Math.ceil(icons.length / perLine);
    const width = cols * ICON_SIZE;
    const height = rows * ICON_SIZE;

    // 提取 <svg ...viewBox="...">...</svg> 里的内容和viewBox
    const extractSVG = (svg: string) => {
        const match = svg.match(/<svg[^>]*viewBox="([^"]*)"[^>]*>([\s\S]*?)<\/svg>/i);
        if (match) {
            return {
                viewBox: match[1],
                content: match[2]
            };
        }
        // fallback
        return {
            viewBox: `0 0 ${ICON_SIZE} ${ICON_SIZE}`,
            content: svg
        };
    };

    // 拼接，每个icon包一层svg，自动由浏览器缩放
    const iconGroup = icons.map((svg, index) => {
        const x = (index % perLine) * ICON_SIZE;
        const y = Math.floor(index / perLine) * ICON_SIZE;
        const { viewBox, content } = extractSVG(svg);
        return `<svg x="${x}" y="${y}" width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
    }).join("\n");

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
        fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
        ${iconGroup}
    </svg>`;
};
