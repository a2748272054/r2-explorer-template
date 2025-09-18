// src/index.ts
import { R2Explorer } from "r2-explorer";

/**
 * Env 类型（根据你实际绑定调整）
 * - BASIC_USER / BASIC_PASS: 必须通过 Cloudflare Dashboard secrets 或 wrangler secret put 设置
 * - bucket: 如果需要传入 R2 binding，可以在这里使用（binding 名称按你在 wrangler.toml / Dashboard 上的设置）
 */
type Env = {
  BASIC_USER?: string;
  BASIC_PASS?: string;
  bucket?: any;
  ASSETS?: any;
  [key: string]: any;
};

/**
 * 根据运行时 env 创建 R2Explorer 实例
 * 我们在每个请求时创建实例（简单且安全）。如果你确认在同一 Environment 下可以缓存实例，
 * 可以把 explorer 缓存到 module 级别以提高性能，但要注意不同环境/secret 的切换。
 */
function createExplorer(env: Env) {
  return R2Explorer({
    readonly: false,
    basicAuth: {
      username: env.BASIC_USER,
      password: env.BASIC_PASS
    },
    // 如果 r2-explorer 支持直接传入 bucket 名称或类似绑定，取消注释并传入：
    // bucket: env.bucket,
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 检查必需的 env/secret
    if (!env.BASIC_USER || !env.BASIC_PASS) {
      return new Response(
        'Missing secrets: please set BASIC_USER and BASIC_PASS as Cloudflare Worker secrets / environment variables.',
        { status: 500 }
      );
    }

    try {
      const explorer = createExplorer(env);

      // r2-explorer 可能导出一个 handler function，或者导出一个对象包含 fetch 方法
      if (typeof explorer === "function") {
        return await explorer(request, env, ctx);
      } else if (explorer && typeof (explorer as any).fetch === "function") {
        return await (explorer as any).fetch(request, env, ctx);
      } else {
        return new Response("R2Explorer: unexpected initialization result", { status: 500 });
      }
    } catch (err: any) {
      // 捕获初始化或运行时错误，返回友好信息（不要在公开环境中回显 secret）
      console.error("R2Explorer init error:", err);
      return new Response("R2Explorer initialization failed. Check worker logs.", { status: 500 });
    }
  }
};
