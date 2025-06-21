export const generateSVG = (icons: string[], perLine: number = 15) => {
    // 假设每个 SVG 的 viewBox 是 0 0 350 350，可以根据实际情况调整 ICON_SIZE
    const ICON_SIZE = 350;

    // 计算画布的列数和行数
    const cols = Math.min(perLine, icons.length);
    const rows = Math.ceil(icons.length / perLine);
    const width = cols * ICON_SIZE;
    const height = rows * ICON_SIZE;

    // 提取每个 SVG 文件的内部内容（去除最外层 <svg ...> 和 </svg>）
    const extractInner = (svg: string) => {
        const match = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
        return match ? match[1] : svg;
    };

    // 处理每个 icon，放在对应位置
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
