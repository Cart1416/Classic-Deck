#!/bin/sh

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect distribution (Arch or Debian-based)
detect_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        case "$ID" in
            arch|manjaro)
                echo "arch"
                ;;
            debian|ubuntu|linuxmint|pop|kali)
                echo "debian"
                ;;
            *)
                echo "unsupported"
                ;;
        esac
    else
        echo "unsupported"
    fi
}

# Install p7zip based on distribution
install_p7zip() {
    distro="$1"
    case "$distro" in
        arch)
            echo "Installing p7zip on Arch-based system..."
            sudo pacman -Sy --noconfirm p7zip
            ;;
        debian)
            echo "Installing p7zip on Debian-based system..."
            sudo apt update && sudo apt install -y p7zip-full
            ;;
        *)
            echo "Unsupported distribution. Exiting."
            exit 1
            ;;
    esac
}

# Main script logic
if command_exists 7z; then
    echo "p7zip is already installed."
else
    distro=$(detect_distro)
    if [ "$distro" = "unsupported" ]; then
        echo "Unsupported distribution. Exiting."
        exit 1
    fi
    install_p7zip "$distro"
fi
