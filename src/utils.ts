export interface TraceLine {
    comm: string;
    pid: number;
    types: string;
    device: {
        minor: number;
        major: number;
    };
    inode: number;
    path: string;
}

export type ParsedTrace = TraceLine[];

export interface Statistics {
    top10writtenPaths: { path: string; value: number }[];
}

export const generateStatistics = (parsedTrace: ParsedTrace): Statistics => {
    const stats: Statistics = {
        top10writtenPaths: [],
    };

    const top10writtenPathsMap = new Map<string, number>();

    for (const trace of parsedTrace) {
        // === Begin top10writtenPaths code === //
        if (trace.types.toLowerCase().includes('w')) {
            const currentValue = top10writtenPathsMap.get(trace.path) || 0;

            top10writtenPathsMap.set(trace.path, currentValue + 1);
        }
        // === End top10writtenPaths code === //
    }

    stats.top10writtenPaths = Array.from(top10writtenPathsMap)
        .map(([path, value]) => ({ path, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    return stats;
};
