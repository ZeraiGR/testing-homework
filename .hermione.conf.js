module.exports = {
  sets: {
    desktop: {
      files: "test/hermione",
    },
  },
  system: {
      fileExtensions: ['.ts', '.js'],
  },
  browsers: {
    chrome: {
      automationProtocol: "devtools",
      retry: 1,
      desiredCapabilities: {
        browserName: "chrome",
      },
      windowSize: {
        width: 1920,
        height: 1080,
      },
      screenshotDelay: 3000,
    },
  },
  plugins: {
    "html-reporter/hermione": {
      enabled: true,
    },
  },
};
