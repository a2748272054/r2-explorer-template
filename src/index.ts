import { R2Explorer } from "r2-explorer";

export default R2Explorer({
  readonly: false,
  basicAuth: {
    username: process.env.BASIC_USER,
    password: process.env.BASIC_PASS
  }
});
