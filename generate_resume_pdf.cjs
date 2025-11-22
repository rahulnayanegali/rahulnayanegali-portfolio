const latex = require('node-latex-pdf');
const path = require('path');

// Add BasicTeX bin directory to PATH so pdflatex can be found
process.env.PATH = `${process.env.PATH}${path.delimiter}/Library/TeX/texbin`;

const inputPath = path.join(__dirname, 'public', 'resume', "rahul_resume.tex");
// The library seems to expect a directory path for the output
const outputDir = path.join(__dirname, 'public', 'resume') + path.sep;

console.log(`Starting PDF conversion...`);
console.log(`Input File: ${inputPath}`);
console.log(`Output Directory: ${outputDir}`);

try {
    latex(inputPath, outputDir, (err, msg) => {
        if (err) {
            console.error(`Error generating PDF: ${msg}`);
            console.error(`Ensure that you have a LaTeX distribution (like MiKTeX or TeX Live) installed and 'pdflatex' is in your PATH.`);
            process.exit(1);
        } else {
            console.log(`Success! PDF generated: ${msg}`);
        }
    });
} catch (e) {
    console.error("An unexpected error occurred:", e);
}
