const fs = require('fs');
const infile = 'nameOfTheRose.txt';
const outfile = 'output.txt';

function parseAndWriteChunks(inputFile, outputFile) {
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const sentences = data.match(/[^.!?,;()]+[.!?,;())]+/g) || [];
        const chunks = [];
        let currentChunk = '';

        for (const sentence of sentences) {
            const potentialChunk = currentChunk + sentence;

            if (potentialChunk.length <= 280) {
                currentChunk = potentialChunk;
            } else {
                chunks.push(currentChunk);
                currentChunk = sentence;
            }
        }

        if (currentChunk.length > 0) {
            chunks.push(currentChunk);
        }

        const outputData = JSON.stringify(chunks);

        fs.writeFile(outputFile, outputData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log(`File "${ outputFile }" written successfully.`);
        });
    });
}

parseAndWriteChunks(infile, outfile);