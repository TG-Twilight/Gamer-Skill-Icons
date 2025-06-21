export const generateSVG = (icons: string[], perLine: number = 15) => {
    const ICON_SIZE = 350;
    const cols = Math.min(perLine, icons.length);
    const rows = Math.ceil(icons.length / perLine);
    const width = cols * ICON_SIZE;
    const height = rows * ICON_SIZE;

    // 只提取 <svg ...>...</svg> 的内容
    const extractInner = (svg: string) => {
        const match = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
        return match ? match[1] : svg;
    };

    // 拼接：每个icon内容包一层<g>，放到对应格子
    const iconGroup = icons.map((svg, index) => {
        const x = (index % perLine) * ICON_SIZE;
        const y = Math.floor(index / perLine) * ICON_SIZE;
        return `<g transform="translate(${x},${y})">${extractInner(svg)}</g>`;
    }).join("\n");

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
        fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
        ${iconGroup}
    </svg>`;
};
