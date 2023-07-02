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
      retry: 3,
      desiredCapabilities: {
        browserName: "chrome",
      },
      windowSize: {
        width: 1920,
        height: 1080,
      },
    },
  },
  plugins: {
    "html-reporter/hermione": {
      enabled: true,
    },
  },
};
