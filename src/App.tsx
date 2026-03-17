import type { ParsedTrace, Statistics } from './utils';
import type { FC } from 'react';

import { useCallback, useState } from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

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

const App: FC = () => {
    const [parsedData, setParsedData] = useState<ParsedTrace | undefined>(
        undefined,
    );

    const [statistics, setStatistics] = useState<Statistics | undefined>(
        undefined,
    );

    const handleParse = useCallback((files: FileList) => {
        if (files.length !== 1) {
            alert('Invalid amount of files selected');
            return;
        }

        const file = files[0];
        const reader = new FileReader();

        reader.onload = event => {
            const results = event.target?.result;

            if (!results) {
                alert('Invalid file provided');
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
                    alert(`Error parsing line ${i + 1}`);
                    continue;
                }
            }

            alert('Successfully parsed file');

            setParsedData(parsed);
            setStatistics(generateStatistics(parsed));
        };

        reader.readAsText(file);
    }, []);

    return (
        <Container sx={{ mt: 1 }}>
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
                                alert('Please select a file!');
                            }
                        }}
                    />
                </Button>
            </Box>
            {parsedData ? (
                <pre>{JSON.stringify(statistics, null, 4)}</pre>
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
