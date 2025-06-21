function parseViewBox(svg: string): [number, number, number, number] {
    const match = svg.match(/viewBox="([\d.\s-]+)"/);
    if (!match) return [0, 0, 350, 350]; // 默认
    const parts = match[1].split(/\s+/).map(Number);
    while (parts.length < 4) parts.push(0);
    return parts as [number, number, number, number];
}

export const generateSVG = (icons: string[], perLine: number = 15) => {
    const ICON_SIZE = 350;
    const cols = Math.min(perLine, icons.length);
    const rows = Math.ceil(icons.length / perLine);
    const width = cols * ICON_SIZE;
    const height = rows * ICON_SIZE;

    // 提取 <svg ...viewBox="...">...</svg> 里的内容和viewBox
    const extractSVG = (svg: string) => {
        const match = svg.match(/<svg[^>]*viewBox="([^"]*)"[^>]*>([\s\S]*?)<\/svg>/i);
        if (match) {
            return {
                viewBox: match[1],
                content: match[2]
            };
        }
        // fallback
        return {
            viewBox: `0 0 ${ICON_SIZE} ${ICON_SIZE}`,
            content: svg
        };
    };

    // 拼接，每个icon用<g>，内容缩放、左上角对齐
    const iconGroup = icons.map((svg, index) => {
        const x = (index % perLine) * ICON_SIZE;
        const y = Math.floor(index / perLine) * ICON_SIZE;
        const { viewBox, content } = extractSVG(svg);
        const [vx, vy, vw, vh] = viewBox.split(/\s+/).map(Number);
        // 计算缩放和位移（填满格子，左上为0,0）
        const scale = Math.min(ICON_SIZE / vw, ICON_SIZE / vh);
        const dx = -vx * scale;
        const dy = -vy * scale;
        return `<g transform="translate(${x},${y}) scale(${scale}) translate(${dx},${dy})">${content}</g>`;
    }).join("\n");

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
        fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
        ${iconGroup}
    </svg>`;
};
