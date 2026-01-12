import { z } from 'zod'
import { 插件 } from '@lsby/net-core'
import { Right } from '@lsby/ts-fp-data'
import { JWT管理器 } from '@lsby/ts-jwt'

class JWT解析插件<解析器类型描述Zod extends z.AnyZodObject> extends 插件<z.ZodNever, 解析器类型描述Zod> {
  constructor(类型表示: 解析器类型描述Zod, jwt实例: JWT管理器<z.infer<typeof 类型表示>>) {
    super(z.never(), 类型表示, async (req, _res) => {
      var data = jwt实例.解析(req.headers.authorization ?? undefined)
      return new Right((data || {}) as z.infer<解析器类型描述Zod>)
    })
  }
}

type 签名正确类型<解析器类型描述Zod extends z.AnyZodObject> = z.ZodObject<{
  signJwt: z.ZodFunction<z.ZodTuple<[解析器类型描述Zod], null>, z.ZodString>
}>

class JWT签名插件<解析器类型描述Zod extends z.AnyZodObject> extends 插件<z.ZodNever, 签名正确类型<解析器类型描述Zod>> {
  constructor(类型表示: 解析器类型描述Zod, jwt实例: JWT管理器<z.infer<typeof 类型表示>>) {
    var 正确类型描述 = z.object({
      signJwt: z.function(z.tuple([类型表示]), z.string()),
    })
    super(z.never(), 正确类型描述, async (_req, _res) => {
      var signJwt = (data: z.infer<typeof 类型表示>): string => jwt实例.签名(data)
      return new Right({ signJwt } as z.infer<typeof 正确类型描述>)
    })
  }
}

export class JWT插件<解析器类型描述Zod extends z.AnyZodObject> {
  private jwt实例: JWT管理器<解析器类型描述Zod>
  public 解析器: JWT解析插件<解析器类型描述Zod>
  public 签名器: JWT签名插件<解析器类型描述Zod>

  constructor(类型表示: 解析器类型描述Zod, 密钥: string, 过期时间: string) {
    this.jwt实例 = new JWT管理器(密钥, 过期时间)
    this.解析器 = new JWT解析插件(类型表示, this.jwt实例)
    this.签名器 = new JWT签名插件(类型表示, this.jwt实例)
  }
}
