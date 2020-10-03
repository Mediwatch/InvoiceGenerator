import * as fs from 'fs'

import createReport from 'docx-templates'

import { getConf } from './getConf'

(async () => {
  const template = fs.readFileSync('input.docx')
  const conf = await getConf()

  const buf = await createReport({
    template,
    cmdDelimiter: ['{{', '}}'],
    data: conf
  })

  fs.writeFileSync('output.docx', buf)
})()
