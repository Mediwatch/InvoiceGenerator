import * as fs from 'fs'

import createReport from 'docx-templates'
import * as libre from 'libreoffice-convert'

import { readFileAsync } from './utilities'
import { Arguments, OutputFormat } from './getArgs'

async function getTemplateAndData(templateFile: string,dataFile: string)
  : Promise<[Buffer, any]>
{
  const [template, dataBuf] = await Promise.all([
    readFileAsync(templateFile),
    readFileAsync(dataFile)
  ])

  const data = JSON.parse(dataBuf.toString())

  return [template, data]
}

async function convertDocxToPdf(docxBuffer: Uint8Array): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    libre.convert(docxBuffer, '.pdf', undefined, (err, pdfBuffer) => {
      if (err) {
        return reject(err)
      }

      resolve(pdfBuffer)
    })
  })
}

export async function generateInvoice(args: Arguments) {
  const [template, data] = await getTemplateAndData(args.template, args.data)

  const buf = await createReport({
    template,
    cmdDelimiter: ['{{', '}}'],
    data
  })

  const writeFlag = args.overwrite ? 'w' : 'wx'

  if (args.format === OutputFormat.Docx) {
    fs.writeFileSync(args.output, buf, {flag: writeFlag})
  } else {
    const pdfBuffer = await convertDocxToPdf(buf)

    fs.writeFileSync(args.output, pdfBuffer, {flag: writeFlag})
  }
}
