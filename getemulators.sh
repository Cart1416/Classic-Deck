chmod +x installp7zip.sh
./installp7zip.sh
mkdir -p emulators
wget -O RetroArch_Qt.7z https://buildbot.libretro.com/stable/1.20.0/linux/x86_64/RetroArch_Qt.7z
7z x RetroArch_Qt.7z -oemulators
rm RetroArch_Qt.7z