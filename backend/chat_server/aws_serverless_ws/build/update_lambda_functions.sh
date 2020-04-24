# install dependencies
sudo apt-get install zip
sudo apt install libpq-dev python-dev

# Command line to push AWS code
sudo apt  install awscli

# Update repo to latest version
read -p "Do you wish to pull repo to latest version? ('y' or 'n')" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    if ! /usr/bin/git pull; then
        echo "Failed to pull."
    fi
fi

# Create environment
if ! [ -d ".env_serverless_chat" ]; then
    virtualenv -p python3 .env_serverless_chat
fi

# Update all environments in the lambda function folders
source .env_serverless_chat/bin/activate
pip install -r requirements.txt

cp -r .env_serverless_chat/* ../src/connect_serverless_ws/.env_serverless_chat
cp -r .env_serverless_chat/* ../src/disconnect_serverless_ws/.env_serverless_chat
cp -r .env_serverless_chat/* ../src/sendMsg_serverless_ws/.env_serverless_chat
cp -r .env_serverless_chat/* ../src/default_serverless_ws/.env_serverless_chat

cp rds_config.py ../src/connect_serverless_ws
cp rds_config.py ../src/disconnect_serverless_ws
cp rds_config.py ../src/sendMsg_serverless_ws
cp rds_config.py ../src/default_serverless_ws

# Close environment and package the lambda functions and push them into AWS
deactivate
cd ../src

# 1) Push connect
read -p "Do you want to update the 'connect' AWS Lambda? ('y' or 'n')" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # wrap package
    cd connect_serverless_ws
    pushd .
    cd .env_serverless_chat/lib/python3.6/site-packages/
    zip -r9 ../../../../function.zip .
    popd
    zip -g function.zip lambda_function.py
    zip -g function.zip rds_config.py
    rm rds_config.py

    # push package on AWS
    aws lambda update-function-code --function-name connect_serverless_ws --zip-file fileb://function.zip --region eu-west-2

    # Clean exit
    cd ../
fi

# 2) Push disconnect function
read -p "Do you want to update the 'disconnect' AWS Lambda? ('y' or 'n')" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # wrap package
    cd disconnect_serverless_ws
    pushd .
    cd .env_serverless_chat/lib/python3.6/site-packages/
    zip -r9 ../../../../function.zip .
    popd
    zip -g function.zip lambda_function.py
    zip -g function.zip rds_config.py
    rm rds_config.py

    # push package on AWS
    aws lambda update-function-code --function-name disconnect_serverless_ws --zip-file fileb://function.zip --region eu-west-2

    # Clean exit
    cd ../
fi


# 3) Push sendMsg function
read -p "Do you want to update the 'sendMsg' AWS Lambda? ('y' or 'n')" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # wrap package
    cd sendMsg_serverless_ws
    pushd .
    cd .env_serverless_chat/lib/python3.6/site-packages/
    zip -r9 ../../../../function.zip .
    popd
    zip -g function.zip lambda_function.py
    zip -g function.zip rds_config.py
    rm rds_config.py

    # push package on AWS
    aws lambda update-function-code --function-name sendMsg_serverless_ws --zip-file fileb://function.zip --region eu-west-2

    # Clean exit
    cd ../
fi


# 4) Push default function
read -p "Do you want to update the 'default' AWS Lambda? ('y' or 'n')" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # wrap package
    cd default_serverless_ws
    pushd .
    cd .env_serverless_chat/lib/python3.6/site-packages/
    zip -r9 ../../../../function.zip .
    popd
    zip -g function.zip lambda_function.py
    zip -g function.zip rds_config.py
    rm rds_config.py

    # push package on AWS
    aws lambda update-function-code --function-name default_serverless_ws --zip-file fileb://function.zip --region eu-west-2

    # Clean exit
    cd ../
fi

