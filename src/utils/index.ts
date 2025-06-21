export const generateSVG = (
    icons: string[],
    perLine: number = 15,
) => {
    const ICON_SIZE = 48;
    const viewBoxSize = 256; // 子SVG的viewBox宽高
    const scale = ICON_SIZE / viewBoxSize;

    const cols = Math.min(perLine, icons.length);
    const rows = Math.ceil(icons.length / perLine);
    const width = cols * ICON_SIZE;
    const height = rows * ICON_SIZE;

    const stripSizeAttrs = (svg: string) =>
        svg.replace(/(<svg[^>]*)\swidth="[^"]*"/i, '$1')
           .replace(/(<svg[^>]*)\sheight="[^"]*"/i, '$1');

    const iconGroup = icons.map((svg, index) => {
        const x = (index % perLine) * ICON_SIZE;
        const y = Math.floor(index / perLine) * ICON_SIZE;
        // scale到48x48，左上对齐
        return `
            <g transform="translate(${x},${y}) scale(${scale})">
                ${stripSizeAttrs(svg)}
            </g>
        `;
    }).join('\n');

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
        xmlns="http://www.w3.org/2000/svg">
        ${iconGroup}
    </svg>`;
};
