import { z } from 'zod'
import { 插件 } from '@lsby/net-core'

let zod类型表示 = z.object({
  authorization: z.string().or(z.undefined()),
})

export class GetAuthorization插件 extends 插件<typeof zod类型表示> {
  constructor() {
    super(zod类型表示, async (req) => {
      return {
        authorization: req.headers.authorization,
      }
    })
  }
}
