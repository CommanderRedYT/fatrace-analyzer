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
    top10writtenPids: { pid: number; value: number }[];
}

export const generateStatistics = (parsedTrace: ParsedTrace): Statistics => {
    const stats: Statistics = {
        top10writtenPaths: [],
        top10writtenPids: [],
    };

    const top10writtenPathsMap = new Map<string, number>();
    const top10writtenPidsMap = new Map<number, number>();

    for (const trace of parsedTrace) {
        // === Begin top10writtenPaths code === //
        if (trace.types.toLowerCase().includes('w')) {
            const currentValue = top10writtenPathsMap.get(trace.path) || 0;

            top10writtenPathsMap.set(trace.path, currentValue + 1);
        }
        // === End top10writtenPaths code === //

        // === Begin top10writtenPids code === //
        if (trace.types.toLowerCase().includes('w')) {
            const currentValue = top10writtenPidsMap.get(trace.pid) || 0;

            top10writtenPidsMap.set(trace.pid, currentValue + 1);
        }
        // === End top10writtenPids code === //
    }

    stats.top10writtenPaths = Array.from(top10writtenPathsMap)
        .map(([path, value]) => ({ path, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    stats.top10writtenPids = Array.from(top10writtenPidsMap)
        .map(([pid, value]) => ({ pid, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    return stats;
};
