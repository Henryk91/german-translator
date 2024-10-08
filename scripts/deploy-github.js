const ghpages = require("gh-pages");
ghpages.publish(
  "build",
  {
    branch: "gh-pages",
    repo: "https://github.com/Henryk91/german-translator.git",
  },
  () => {
    console.log("Deploy Complete!");
  }
);
