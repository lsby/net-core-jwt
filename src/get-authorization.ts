import { z } from 'zod'
import { 插件 } from '@lsby/net-core'
import { Right } from '@lsby/ts-fp-data'

var 错误类型描述 = z.never()
let 正确类型描述 = z.object({
  authorization: z.string().or(z.undefined()),
})

export class GetAuthorization插件 extends 插件<typeof 错误类型描述, typeof 正确类型描述> {
  constructor() {
    super(错误类型描述, 正确类型描述, async (req, _res) => {
      return new Right({
        authorization: req.headers.authorization,
      })
    })
  }
}
