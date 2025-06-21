export const generateSVG = (icons: string[], perLine: number = 15) => {
    // 取所有icons的viewBox宽高，假定都一样（如果不一样可进一步适配）
    const getViewBox = (svg: string) => {
        const match = svg.match(/viewBox="([\d.\s-]+)"/i);
        if (!match) return [0, 0, 350, 350];
        return match[1].split(/\s+/).map(Number);
    };
    const [vx, vy, vw, vh] = getViewBox(icons[0]); // 用第一个icon的viewBox

    const ICON_SIZE = vw; // 使用viewBox宽度
    const GAP = 0; // 你可以根据需求调整格子间距，默认0
    const cols = Math.min(perLine, icons.length);
    const rows = Math.ceil(icons.length / perLine);
    const width = cols * ICON_SIZE + (cols - 1) * GAP;
    const height = rows * ICON_SIZE;

    // 保留原始<svg>内容，移除width/height属性，避免缩放失真
    const stripSizeAttrs = (svg: string) => {
        return svg
          .replace(/(<svg[^>]*)\swidth="[^"]*"/i, '$1')
          .replace(/(<svg[^>]*)\sheight="[^"]*"/i, '$1');
    };

    const iconGroup = icons.map((svg, index) => {
        const col = index % perLine;
        const row = Math.floor(index / perLine);
        const x = col * (ICON_SIZE + GAP);
        const y = row * ICON_SIZE;
        return `<g transform="translate(${x}, ${y})">${stripSizeAttrs(svg)}</g>`;
    }).join('\n');

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
        fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
        <defs></defs>
        ${iconGroup}
    </svg>`;
};
