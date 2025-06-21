export const generateSVG = (icons: string[], perLine: number = 15) => {
    const ICON_SIZE = 350;
    const cols = Math.min(perLine, icons.length);
    const rows = Math.ceil(icons.length / perLine);
    const width = cols * ICON_SIZE;
    const height = rows * ICON_SIZE;

    // 提取 <defs>，收集所有
    let allDefs: string[] = [];
    const extractInner = (svg: string) => {
        // 收集 defs
        const defsMatch = svg.match(/<defs>([\s\S]*?)<\/defs>/i);
        if (defsMatch) {
            allDefs.push(defsMatch[1]);
        }
        // 提取 <g>...</g>
        const gMatch = svg.match(/<g[^>]*>([\s\S]*?)<\/g>/i);
        return gMatch ? `<g>${gMatch[1]}</g>` : svg;
    };

    const iconGroup = icons.map((svg, index) => {
        const x = (index % perLine) * ICON_SIZE;
        const y = Math.floor(index / perLine) * ICON_SIZE;
        return `<g transform="translate(${x},${y})">${extractInner(svg)}</g>`;
    }).join('\n');

    // 合并所有 defs（去重可选）
    let defsSection = '';
    if (allDefs.length) {
        defsSection = `<defs>\n${allDefs.join('\n')}\n</defs>\n`;
    }

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
        fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
        ${defsSection}${iconGroup}
    </svg>`;
};
