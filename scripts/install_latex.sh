#!/bin/bash
set -e

# Define the TinyTeX bin path for Linux
TINYTEX_BIN="$HOME/.TinyTeX/bin/x86_64-linux"

# Function to add TinyTeX to PATH
add_to_path() {
    export PATH="$TINYTEX_BIN:$PATH"
    echo "Added TinyTeX to PATH: $PATH"
}

# Check if pdflatex is already available
if command -v pdflatex >/dev/null 2>&1; then
    echo "pdflatex is already installed."
    exit 0
fi

# Check if TinyTeX is installed but not in PATH
if [ -d "$TINYTEX_BIN" ]; then
    echo "TinyTeX found at $TINYTEX_BIN"
    add_to_path
else
    echo "pdflatex not found. Installing TinyTeX..."
    
    # Download and install TinyTeX (minimal)
    # --admin --no-path prevents it from trying to modify shell profiles which might fail or not load
    wget -qO- "https://yihui.org/tinytex/install-bin-unix.sh" | sh -s - --admin --no-path
    
    add_to_path
    
    echo "Installing required LaTeX packages..."
    # Install packages required by the resume
    # Note: We install packages even if local .sty files exist to ensure fonts and dependencies are present
    "$TINYTEX_BIN/tlmgr" install \
        lmodern \
        latexsym \
        marvosym \
        graphics \
        tools \
        enumitem \
        hyperref \
        fancyhdr \
        babel \
        babel-english \
        tabularx \
        geometry \
        oberdiek \
        url \
        etoolbox \
        xcolor
        
    echo "LaTeX packages installed."
fi

# Verify installation
if "$TINYTEX_BIN/pdflatex" --version >/dev/null 2>&1; then
    echo "pdflatex successfully installed and verified."
else
    echo "Error: pdflatex installation failed or not found."
    exit 1
fi
