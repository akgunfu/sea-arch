debug:
	yarn start

start:
	-killall adb
	yarn production

install:
	-brew install yarn
	-brew install python@2
	-brew install tesseract-lang
	-brew cask install android-platform-tools
	-pip install -r requirements.txt
	-yarn install
