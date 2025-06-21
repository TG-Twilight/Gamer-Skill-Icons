export const generateSVG = (
    icons: string[],
    perLine: number = 15,
    iconSize: number = 48
) => {
    // 提取viewBox
    const getViewBox = (svg: string) => {
        const match = svg.match(/viewBox="([\d.\s-]+)"/i);
        return match ? match[1].split(/\s+/).map(Number) : [0,0,256,256];
    };

    const cols = Math.min(perLine, icons.length);
    const rows = Math.ceil(icons.length / perLine);
    const width = cols * iconSize;
    const height = rows * iconSize;

    const stripSizeAttrs = (svg: string) =>
        svg.replace(/(<svg[^>]*)\swidth="[^"]*"/i, '$1')
           .replace(/(<svg[^>]*)\sheight="[^"]*"/i, '$1');

    const iconGroup = icons.map((svg, index) => {
        const [vx, vy, vw, vh] = getViewBox(svg);
        const scale = iconSize / Math.max(vw, vh);
        // 居中对齐（如果vw!=vh也能居中）
        const offsetX = (iconSize - vw * scale) / 2;
        const offsetY = (iconSize - vh * scale) / 2;
        const x = (index % perLine) * iconSize + offsetX;
        const y = Math.floor(index / perLine) * iconSize + offsetY;
        return `<g transform="translate(${x},${y}) scale(${scale}) translate(${-vx},${-vy})">
            ${stripSizeAttrs(svg)}
        </g>`;
    }).join('\n');

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
        xmlns="http://www.w3.org/2000/svg">
        ${iconGroup}
    </svg>`;
};
