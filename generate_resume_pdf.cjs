const { spawn } = require('child_process');
const path = require('path');

// Add BasicTeX bin directory to PATH so pdflatex can be found
// Add BasicTeX bin directory to PATH so pdflatex can be found (macOS only)
if (process.platform === 'darwin') {
    process.env.PATH = `${process.env.PATH}${path.delimiter}/Library/TeX/texbin`;
}

const inputPath = path.join(__dirname, 'public', 'resume', "rahulnayanegali_resume.tex");
const outputDir = path.join(__dirname, 'public', 'resume');

console.log(`Starting PDF conversion...`);
console.log(`Input File: ${inputPath}`);
console.log(`Output Directory: ${outputDir}`);

const runPdflatex = () => {
    return new Promise((resolve, reject) => {
        const pdflatex = spawn('pdflatex', [
            '-interaction=nonstopmode',
            `-output-directory=${outputDir}`,
            inputPath
        ]);

        pdflatex.on('error', (err) => {
            console.error('Failed to start pdflatex. Is it installed?', err);
            reject(err);
        });

        pdflatex.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        pdflatex.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        pdflatex.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(code);
            }
        });
    });
};

(async () => {
    try {
        console.log("First pass...");
        await runPdflatex();
        console.log("Second pass (for references)...");
        await runPdflatex();
        console.log(`Success! PDF generated in ${outputDir}`);
    } catch (code) {
        console.error(`pdflatex process exited with code ${code}`);
        console.error(`Check the log file in ${outputDir} for more details.`);
        process.exit(1);
    }
})();
