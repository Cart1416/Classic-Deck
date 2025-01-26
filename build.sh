pyinstaller --name Classic_Deck --noconfirm --noconsole \
    --add-data "chromium:chromium" \
    --add-data "public:public" \
    --add-data "emulators:emulators" \
    --add-data "cores:cores" \
    main.py
echo "Check the dist folder"
