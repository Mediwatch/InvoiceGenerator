import * as commandpost from 'commandpost';

interface Options {
  output: string[],
  format: string[],
  overwrite: boolean
}

interface RawArguments {
  files: string[]
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
  template: string,
  data: string,
  format: OutputFormat,
  output: string,
  overwrite: boolean
}

export async function getArgs(): Promise<Arguments> {
  let commandParser = commandpost
    .create<Options, RawArguments>('invoice_generator [files...]')
    .version('1.0.0', '-v, --version')
    .description('Generates a pdf/docx invoice from a template and json data')
    .option('-o, --output <name>', 'Output file name. default: output.pdf/output.docx')
    .option('-f, --format <name>', 'File format of the output, can be either "pdf" or "docx". default: pdf')
    .option('-w, --overwrite', 'Overwrites the output file if it already exists')
    .action((opts, args) => {
      let format = opts.format[0] || 'pdf'
      const output = opts.output[0] || 'output.' + format

      format = OUTPUT_FORMATS[format]

      if (format === undefined) {
        throw Error('Invalid output format')
      } else if (args.files.length !== 2) {
        throw Error('Invalid number of arguments\nUSAGE: invoice_generator <docx_template> <json_data>')
      }

      return {
        template: args.files[0],
        data: args.files[1],
        format,
        output,
        overwrite: opts.overwrite
      }
    })

  return commandpost.exec(commandParser, process.argv) as Promise<Arguments>
}
