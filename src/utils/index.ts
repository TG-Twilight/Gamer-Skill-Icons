export const generateSVG = (icons: string[], perLine: number = 15) => {
    // 取所有icon的viewBox，找到最大宽高
    const viewBoxes = icons.map(svg => {
        const m = svg.match(/viewBox="([\d.\s-]+)"/i);
        return m ? m[1].split(/\s+/).map(Number) : [0,0,350,350];
    });
    const maxW = Math.max(...viewBoxes.map(([x, y, w, h]) => w));
    const maxH = Math.max(...viewBoxes.map(([x, y, w, h]) => h));
    const ICON_SIZE = Math.max(maxW, maxH);
    const cols = Math.min(perLine, icons.length);
    const rows = Math.ceil(icons.length / perLine);
    const width = cols * ICON_SIZE;
    const height = rows * ICON_SIZE;

    const stripSizeAttrs = (svg: string) => svg.replace(/(<svg[^>]*)\swidth="[^"]*"/i, '$1').replace(/(<svg[^>]*)\sheight="[^"]*"/i, '$1');
    const iconGroup = icons.map((svg, index) => {
        const x = (index % perLine) * ICON_SIZE;
        const y = Math.floor(index / perLine) * ICON_SIZE;
        // 居中适配
        const [vx, vy, vw, vh] = viewBoxes[index];
        const scale = Math.min(ICON_SIZE / vw, ICON_SIZE / vh);
        const dx = (ICON_SIZE - vw * scale) / 2;
        const dy = (ICON_SIZE - vh * scale) / 2;
        return `<g transform="translate(${x + dx}, ${y + dy}) scale(${scale})">${stripSizeAttrs(svg)}</g>`;
    }).join('\n');

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        ${iconGroup}
    </svg>`;
};
