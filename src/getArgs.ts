import * as commandpost from 'commandpost';

const VALID_OUTPUT_FORMATS = ['pdf', 'docx']

export async function getArgs(): Promise<[string, string, string, string, boolean]> {
  let commandParser = commandpost
    .create<
      { output: string[], format: string[], overwrite: boolean }, // options
      { files: string[] }> // args
      ('invoice_generator [files...]')
    .version('1.0.0', '-v, --version')
    .description('Generates a pdf/docx invoice from a template and json data')
    .option('-o, --output <name>', 'Output file name. default: output.pdf/output.docx')
    .option('-f, --format <name>', 'File format of the output, can be either "pdf" or "docx". default: pdf')
    .option('--overwrite', 'Overwrites the output file if it already exists')
    .action((opts, args) => {
      let format = opts.format[0] || 'pdf'
      let output = opts.output[0] || 'output.' + format

      if (!VALID_OUTPUT_FORMATS.includes(format)) {
        throw Error('Invalid output format')
      } else if (args.files.length !== 2) {
        throw Error('Invalid number of arguments\nUSAGE: invoice_generator <docx_template> <json_data>')
      }

      return [args.files[0], args.files[1], format, output, opts.overwrite]
    })

  return commandpost.exec(commandParser, process.argv) as Promise<[string, string, string, string, boolean]>
}
