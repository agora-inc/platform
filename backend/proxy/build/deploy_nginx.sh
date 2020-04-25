# Update repo to latest version
read -p "Do you wish to pull repo to latest version? ('y' or 'n')" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    if ! /usr/bin/git pull; then
        echo "Failed to pull."
    fi
fi

# Deploy nginx configs
sudo rm /etc/nginx/sites-enabled/agora
sudo cp nginx_config /etc/nginx/sites-available/agora
sudo ln -s /etc/nginx/sites-available/agora /etc/nginx/sites-enabled/
