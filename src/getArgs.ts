import * as commandpost from 'commandpost';
import { readFileAsync } from './utilities';

interface Options {
  output: string[],
  format: string[],
  overwrite: boolean,
  data: string,
  dataFile: string
}

interface RawArguments {
  template: string
}

export enum OutputFormat {
  Pdf,
  Docx
}

export const OUTPUT_FORMATS = {
  pdf: OutputFormat.Pdf,
  docx: OutputFormat.Docx
}

export interface Arguments {
  templateFile: string,
  format: OutputFormat,
  output: string,
  overwrite: boolean,
  data: string,
}

async function getDataFromFile(dataFile: string) : Promise<any>
{
  const dataBuf = await readFileAsync(dataFile)
  const data = JSON.parse(dataBuf.toString())

  return data
}

export async function getArgs(): Promise<Arguments> {
  let commandParser = commandpost
    .create<Options, RawArguments>('invoice_generator <template>')
    .version('1.0.0', '-v, --version')
    .description('Generates a pdf/docx invoice from a template and json data')
    .option('-o, --output <name>', 'Output file name. default: output.pdf/output.docx')
    .option('-f, --format <name>', 'File format of the output, can be either "pdf" or "docx". default: pdf')
    .option('-w, --overwrite', 'Overwrites the output file if it already exists')
    .option('-d, --data <data>', 'A JSON string representing the data')
    .option('-D, --data-file <data-file>', 'A JSON file representing the data')
    .action(async (opts, args) => {
      let format = opts.format[0] || 'pdf'
      const output = opts.output[0] || 'output.' + format
      let data

      format = OUTPUT_FORMATS[format]

      if (format === undefined) {
        throw Error('Invalid output format')
      } else if (opts.dataFile.length === 0 && opts.data.length === 0) {
        throw Error('No data given, use -h for more information')
      } else if (opts.dataFile.length !== 0 && opts.data.length !== 0) {
        throw Error('Use either --data or --data-file, not both')
      } else if (args.template === undefined) {
        throw Error('Invalid number of arguments\nUSAGE: invoice_generator <docx_template>')
      }

      if (opts.dataFile.length !== 0) {
        data = await getDataFromFile(opts.dataFile[0])
      } else {
        data = JSON.parse(opts.data[0])
      }

      return {
        templateFile: args.template,
        data,
        format,
        output,
        overwrite: opts.overwrite
      }
    })

  return commandpost.exec(commandParser, process.argv) as Promise<Arguments>
}
