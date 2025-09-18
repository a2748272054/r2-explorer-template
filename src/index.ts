import { R2Explorer } from "r2-explorer";

export default R2Explorer({
  readonly: false,
  basicAuth: {
    username: BASIC_USER,  // 直接用绑定变量名
    password: BASIC_PASS
  }
});
