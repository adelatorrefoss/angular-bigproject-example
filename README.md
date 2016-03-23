# AngularJS BigProject Example

Example of a Big Project with AngularJS 1.5 with Tests: Unit, Protractor and Cucumber

## Pre requisites

### nvm
nvm version fixed by .nvmrc
```
nvm use
nvm install
```

## Install
```
npm install
```

In first installation is possible that gulp throws an error about scss_lint
Install gem sccs_lint
```
gem install scss_lint
```

## Development
Default task compile & watch & start a localhost:8080 webserver
```
gulp
```


## Production
```
gulp deploy
```

## Unit tests

### Single run and finish (for CI)
```
gulp test
```

### Continuous and watching changes in source and tests

```
gulp tdd
```


## End to End (with Protractor)

### Install

https://angular.github.io/protractor/

```
# npm to install Protractor globally with:
npm install -g protractor

# install webdriver-manager, is a helper to get an instance of a Selenium Server:
webdriver-manager update
```

### Steps

```
# First console
gulp

# Second console
webdriver-manager start

# Third console
protractor protractor.conf.js
```
