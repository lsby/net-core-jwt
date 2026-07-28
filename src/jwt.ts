import { z } from 'zod'
import { 插件 } from '@lsby/net-core'
import { Right } from '@lsby/ts-fp-data'
import { JWT管理器 } from '@lsby/ts-jwt'

export class JWT解析插件<解析器类型描述Zod extends z.AnyZodObject> extends 插件<z.ZodNever, 解析器类型描述Zod> {
  constructor(类型表示: 解析器类型描述Zod, jwt实例: JWT管理器<z.infer<typeof 类型表示>>) {
    super(z.never(), 类型表示, async (req, _res) => {
      var data = jwt实例.解析(req.headers.authorization ?? undefined)
      return new Right((data || {}) as z.infer<解析器类型描述Zod>)
    })
  }
}

export type 签名正确类型<解析器类型描述Zod extends z.AnyZodObject> = z.ZodObject<{
  signJwt: z.ZodFunction<z.ZodTuple<[解析器类型描述Zod], null>, z.ZodString>
}>

export class JWT签名插件<解析器类型描述Zod extends z.AnyZodObject> extends 插件<
  z.ZodNever,
  签名正确类型<解析器类型描述Zod>
> {
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

export class JWT异步解析插件<解析器类型描述 extends z.AnyZodObject> extends 插件<z.ZodNever, 解析器类型描述> {
  public constructor(类型表示: 解析器类型描述, jwt实例: JWT管理器<z.infer<解析器类型描述>>) {
    super(z.never(), 类型表示, async (req) => {
      let data = await jwt实例.异步解析(req.headers.authorization ?? undefined)
      return new Right((data ?? {}) as z.infer<解析器类型描述>)
    })
  }
}

export type 异步签名正确类型<签名器类型描述 extends z.AnyZodObject> = z.ZodObject<{
  signJwt: z.ZodFunction<z.ZodTuple<[签名器类型描述], null>, z.ZodPromise<z.ZodString>>
}>

export class JWT异步签名插件<签名器类型描述 extends z.AnyZodObject> extends 插件<
  z.ZodNever,
  异步签名正确类型<签名器类型描述>
> {
  public constructor(类型表示: 签名器类型描述, jwt实例: JWT管理器<z.infer<签名器类型描述>>) {
    let 正确类型描述 = z.object({
      signJwt: z.function(z.tuple([类型表示]), z.promise(z.string())),
    })
    super(z.never(), 正确类型描述, async () => {
      let signJwt = async (data: z.infer<签名器类型描述>): Promise<string> => {
        return await jwt实例.异步签名(data)
      }
      return new Right({ signJwt } as z.infer<typeof 正确类型描述>)
    })
  }
}

export class JWT异步插件<类型描述 extends z.AnyZodObject> {
  private readonly jwt实例: JWT管理器<z.infer<类型描述>>
  public readonly 异步解析器: JWT异步解析插件<类型描述>
  public readonly 异步签名器: JWT异步签名插件<类型描述>

  public constructor(类型表示: 类型描述, 密钥: string, 过期时间: string) {
    this.jwt实例 = new JWT管理器(密钥, 过期时间)
    this.异步解析器 = new JWT异步解析插件(类型表示, this.jwt实例)
    this.异步签名器 = new JWT异步签名插件(类型表示, this.jwt实例)
  }
}
