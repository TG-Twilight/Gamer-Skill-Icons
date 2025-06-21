export const generateSVG = (icons: string[], perLine: number = 15) => {
    const ICON_SIZE = 350;
    const cols = Math.min(perLine, icons.length);
    const rows = Math.ceil(icons.length / perLine);
    const width = cols * ICON_SIZE;
    const height = rows * ICON_SIZE;

    // 只提取 <g>...</g>，忽略 <switch>/<foreignObject>
    const extractInner = (svg: string) => {
        const gMatch = svg.match(/<g[^>]*>([\s\S]*?)<\/g>/i);
        return gMatch ? `<g>${gMatch[1]}</g>` : svg;
    };

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
