#!/bin/bash
# Loop through directories
for dir in */; do
  dir=${dir%/}
  if [ -d "$dir" ]; then
    echo "directory: $dir"
    cd "$dir"
    
    # Install dependencies
    npm install
    npm install -g pm2

    # Start services based on directory name
    if [ "$dir" == "plants" ]; then
      sudo pm2 start index.js --name "wxapp-plants" -- --host 0.0.0.0 --port 4000
      echo "Started wxapp-plants"
    fi

    if [ "$dir" == "event-bus" ]; then
      sudo pm2 start index.js --name "wxapp-eventbus" -- --host 0.0.0.0 --port 4005
      echo "Started wxapp-eventbus"
    fi

    if [ "$dir" == "calculation" ]; then
      sudo pm2 start index.js --name "wxapp-calculation" -- --host 0.0.0.0 --port 4002
      echo "Started wxapp-calculation"
    fi

    if [ "$dir" == "precipitation" ]; then
      sudo pm2 start index.js --name "wxapp-precipitation" -- --host 0.0.0.0 --port 4001
      echo "Started wxapp-precipitation"
    fi

    # Save pm2 process list and set pm2 to start on boot
    sudo pm2 save
    sudo pm2 startup

    # Go back to the parent directory
    cd ..
  fi
done