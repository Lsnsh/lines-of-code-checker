const { exec } = require("child_process");

test("smoke test for command-line tool", (done) => {
  exec(`locc -l 10 -d ./test`, (error, stdout, stderr) => {
    expect(error).toBeNull();
    expect(stderr).toBe("");
    expect(stdout).toContain("Scan");
    done();
  });
});
