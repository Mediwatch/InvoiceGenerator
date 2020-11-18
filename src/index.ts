import * as fs from 'fs'

import createReport from 'docx-templates'
import * as libre from 'libreoffice-convert'

import { readFileAsync } from './utilities'
import { getArgs } from './getArgs'

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

async function generateInvoice(templateFile, dataFile, format, output, overwrite) {
  const [template, dataBuf] = await Promise.all([
    readFileAsync(templateFile),
    readFileAsync(dataFile)
  ])

  const data = JSON.parse(dataBuf.toString())

  const buf = await createReport({
    template,
    cmdDelimiter: ['{{', '}}'],
    data
  })

  if (format === 'docx') {
    fs.writeFileSync(output, buf, {flag: overwrite ? 'w' : 'wx'})
  } else {
    const pdfBuffer = await convertDocxToPdf(buf)

    fs.writeFileSync(output, pdfBuffer, {flag: overwrite ? 'w' : 'wx'})
  }
}

async function main() {
  try {
    const [template, data, format, output, overwrite] = await getArgs()
    await generateInvoice(template, data, format, output, overwrite)
  } catch (e) {
    console.log(e.message)
  }
}

main()
