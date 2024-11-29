const { exec } = require("child_process");
const path = require("path");

test("smoke test for command-line tool", (done) => {
  const scriptPath = path.join(__dirname, "../src/index.js");
  exec(`node ${scriptPath} -l 10 -d ./test`, (error, stdout, stderr) => {
    expect(error).toBeNull();
    expect(stderr).toBe("");
    expect(stdout).toContain("Scan");
    done();
  });
});
