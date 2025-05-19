import { z } from 'zod'
import { 插件 } from '@lsby/net-core'

let zod类型表示 = z.object({
  token: z.string().or(z.undefined()),
})

export class GetToken插件 extends 插件<typeof zod类型表示> {
  constructor() {
    super(zod类型表示, async (req) => {
      return {
        token: req.headers.authorization,
      }
    })
  }
}
