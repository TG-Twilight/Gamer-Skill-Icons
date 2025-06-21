export const generateSVG = (icons: string[], perLine: number = 15) => {
    // 兼容性、还原原图标比例和布局，最好直接用每个原svg的viewBox和内容
    const ICON_SIZE = 256; // 你的原图标是256x256不是350x350
    const cols = Math.min(perLine, icons.length);
    const rows = Math.ceil(icons.length / perLine);
    const width = cols * ICON_SIZE + (cols - 1) * 44.25; // 44.25是原项目两icon之间的横向间距
    const height = rows * ICON_SIZE; // 原项目没有纵向间距

    // 提取<svg ...viewBox="...">...</svg>里的viewBox和内容
    const extractSVG = (svg: string) => {
        const match = svg.match(/<svg[^>]*viewBox="([^"]*)"[^>]*>([\s\S]*?)<\/svg>/i);
        const widthMatch = svg.match(/width="([\d.]+)"/i);
        const heightMatch = svg.match(/height="([\d.]+)"/i);
        return {
            viewBox: match ? match[1] : `0 0 256 256`,
            content: match ? match[2] : svg,
            width: widthMatch ? Number(widthMatch[1]) : ICON_SIZE,
            height: heightMatch ? Number(heightMatch[1]) : ICON_SIZE,
        };
    };

    const iconGroup = icons.map((svg, index) => {
        const col = index % perLine;
        const row = Math.floor(index / perLine);
        const x = col * (ICON_SIZE + 44.25); // 与原项目保持一致
        const y = row * ICON_SIZE;
        const { viewBox, content, width, height } = extractSVG(svg);

        // 保证每个icon原比例、原viewBox
        return `
            <g transform="translate(${x}, ${y})">
                <svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">
                    ${content}
                </svg>
            </g>
        `;
    }).join('\n');

    // 外层svg也和原项目保持一致
    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
        fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
        <defs></defs>
        ${iconGroup}
    </svg>`;
};
