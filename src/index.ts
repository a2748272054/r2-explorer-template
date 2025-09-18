import { R2Explorer } from "r2-explorer";

export default R2Explorer({
  readonly: false,   // 允许上传文件
  basicAuth: {
    username: BASIC_USER,  // Worker Secret
    password: BASIC_PASS   // Worker Secret
  }
});
