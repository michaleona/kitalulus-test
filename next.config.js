const path = require("path");

module.exports = {
  basePath: "/kitalulus-test",
  sassOptions: {
    includePaths: [path.join(__dirname, "asset/css")],
  },
};
