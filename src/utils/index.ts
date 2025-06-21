// 解析 viewBox 的宽高
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

    // 提取内容和 viewBox
    const extractInner = (svg: string) => {
        const match = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
        return match ? match[1] : svg;
    };

    // 拼接每个 icon，自动缩放居左上
    const iconGroup = icons.map((svg, index) => {
        const x = (index % perLine) * ICON_SIZE;
        const y = Math.floor(index / perLine) * ICON_SIZE;
        const [vx, vy, vw, vh] = parseViewBox(svg);
        // 计算缩放
        const scale = Math.min(ICON_SIZE / vw, ICON_SIZE / vh);
        // 注意要把内容平移到 0,0
        const translate = `translate(${-vx * scale},${-vy * scale}) scale(${scale})`;
        return `<g transform="translate(${x},${y}) ${translate}">${extractInner(svg)}</g>`;
    }).join("\n");

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
        fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
        ${iconGroup}
    </svg>`;
};
