pyinstaller --name Classic_Deck --noconfirm \
    --add-data "scripts:scripts" \
    --add-data "chromium:chromium" \
    --add-data "public:public" \
    main.py
echo "Check the dist folder"
