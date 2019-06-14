#!/bin/zsh
log_file="/path/to/log/file.log"
node vote.js | tee -a $log_file
