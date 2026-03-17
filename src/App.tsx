import type { ParsedTrace, Statistics } from './utils';
import type { FC } from 'react';

import { useCallback, useState } from 'react';

import { Bar } from 'react-chartjs-2';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { enqueueSnackbar } from 'notistack';

import { generateStatistics } from './utils';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const MonospaceLi = styled('li')({
    fontFamily: 'monospace',
});

const Code = styled('code')(({ theme }) => ({
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    padding: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
}));

const App: FC = () => {
    const [parsedData, setParsedData] = useState<ParsedTrace | undefined>(
        undefined,
    );

    const [statistics, setStatistics] = useState<Statistics | undefined>(
        undefined,
    );

    const handleParse = useCallback((files: FileList) => {
        if (files.length !== 1) {
            enqueueSnackbar('Invalid amount of files selected', {
                variant: 'error',
            });
            return;
        }

        const file = files[0];
        const reader = new FileReader();

        reader.onload = event => {
            const results = event.target?.result;

            if (!results) {
                enqueueSnackbar('Invalid file provided', {
                    variant: 'error',
                });
                return;
            }

            const resultsText = String(results);

            const lines = resultsText.split('\n').filter(Boolean);
            const parsed = [];

            for (let i = 0; i < lines.length; i++) {
                try {
                    parsed.push(JSON.parse(lines[i]));
                } catch (e) {
                    console.error(
                        `Unable to parse line ${i + 1} of ${lines.length}`,
                        e,
                    );
                    enqueueSnackbar(`Error parsing line ${i + 1}`, {
                        variant: 'error',
                    });
                }
            }

            enqueueSnackbar('Successfully parsed file', {
                variant: 'success',
            });

            setParsedData(parsed);
            setStatistics(generateStatistics(parsed));
        };

        reader.readAsText(file);
    }, []);

    return (
        <Container sx={{ mt: 1, mb: 2 }}>
            <Box mb={2}>
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Typography variant="h4">Fatrace Analyzer</Typography>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload files
                        <VisuallyHiddenInput
                            type="file"
                            accept="application/json"
                            onChange={event => {
                                if (event.target.files) {
                                    handleParse(event.target.files);
                                } else {
                                    enqueueSnackbar('Please select a file!', {
                                        variant: 'error',
                                    });
                                }
                            }}
                        />
                    </Button>
                </Box>
                <Typography>
                    To generate a file for this tool, run the following command:{' '}
                    <Code>fatrace -o /path/to/trace.json -j</Code>
                </Typography>
            </Box>
            {parsedData && statistics ? (
                <Box>
                    <Box>
                        <Typography>Top 10 Written Paths</Typography>
                        <Bar
                            data={{
                                labels: statistics.top10writtenPaths.map(
                                    item => item.path,
                                ),
                                datasets: [
                                    {
                                        label: 'Written Paths',
                                        data: statistics.top10writtenPaths.map(
                                            item => item.value,
                                        ),
                                        backgroundColor:
                                            'rgba(75, 192, 192, 0.6)',
                                        borderColor: 'rgba(75, 192, 192, 1)',
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: tickValue =>
                                                `${tickValue} writes`,
                                        },
                                    },
                                },
                            }}
                        />
                        <ol>
                            {statistics.top10writtenPaths.map(item => (
                                <MonospaceLi key={item.path}>
                                    {item.path}
                                </MonospaceLi>
                            ))}
                        </ol>
                    </Box>
                    <Box>
                        <Typography>Top 10 Written PIDs</Typography>
                        <Bar
                            data={{
                                labels: statistics.top10writtenPids.map(
                                    item => item.pid,
                                ),
                                datasets: [
                                    {
                                        label: 'Written Pids',
                                        data: statistics.top10writtenPids.map(
                                            item => item.value,
                                        ),
                                        backgroundColor:
                                            'rgba(75, 192, 192, 0.6)',
                                        borderColor: 'rgba(75, 192, 192, 1)',
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: tickValue =>
                                                `${tickValue} writes`,
                                        },
                                    },
                                },
                            }}
                        />
                        <ol>
                            {statistics.top10writtenPids.map(item => (
                                <MonospaceLi key={item.pid}>
                                    Process {item.pid}
                                </MonospaceLi>
                            ))}
                        </ol>
                    </Box>
                </Box>
            ) : (
                <Box
                    my={4}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography variant="h6">
                        Please select a file above to parse
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default App;
