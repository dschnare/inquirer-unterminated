# Inquirer Unterminated Process Test

This repo contains a reproduction of a bug that causes a Node process to never
terminate after calling `inquirer#prompt` several times with a time consuming
task occuring in between calls.

To run the test and repro the problem.

```
node ./unterminated-process-test
```

This script should print three empty objects `{}` on a single line and the
process should terminate. However, the process never terminates. The cause seems
to be linked to the combination of having the `when` option set to `false` for
each question *and* having a time consuming task occurr between calling multiple
`inquirer#prompt` calls.

See [unterminated-process-test.js](./unterminated-process-test.js) for details.