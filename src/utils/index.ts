export const generateSVG = (icons: string[], perLine: number = 15) => {
    // 取所有icons的viewBox
    const getViewBox = (svg: string) => {
        const match = svg.match(/viewBox="([\d.\s-]+)"/i);
        return match ? match[1].split(/\s+/).map(Number) : [0,0,350,350];
    };
    const [vx, vy, vw, vh] = getViewBox(icons[0]);
    const ICON_SIZE = Math.max(vw, vh); // 350
    const cols = Math.min(perLine, icons.length);
    const rows = Math.ceil(icons.length / perLine);
    const width = cols * ICON_SIZE;
    const height = rows * ICON_SIZE;

    const extractInner = (svg: string) => {
        const match = svg.match(/<g[^>]*>([\s\S]*?)<\/g>/i);
        return match ? match[1] : svg;
    };

    const iconGroup = icons.map((svg, index) => {
        const [vx, vy, vw, vh] = getViewBox(svg);
        const scale = ICON_SIZE / Math.max(vw, vh);
        // 内容居中
        const offsetX = (ICON_SIZE - vw * scale) / 2;
        const offsetY = (ICON_SIZE - vh * scale) / 2;
        const x = (index % perLine) * ICON_SIZE;
        const y = Math.floor(index / perLine) * ICON_SIZE;
        return `<g transform="translate(${x + offsetX}, ${y + offsetY}) scale(${scale}) translate(${-vx},${-vy})">${extractInner(svg)}</g>`;
    }).join('\n');

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        ${iconGroup}
    </svg>`;
};
