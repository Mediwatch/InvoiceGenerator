import * as commandpost from 'commandpost';

const VALID_OUTPUT_FORMATS = ['pdf', 'docx']

export async function getArgs(): Promise<[string, string, string, string]> {
  return new Promise((resolve, reject) => {
      let commandParser = commandpost
      .create<
        { output: string[], format: string[] }, // options
        { template_file: string, json_data_file: string }> // args
        ('dinner <template_file> <json_data_file>')
      .version('1.0.0', '-v, --version')
      .description('Generates a pdf/docx invoice from a template and json data')
      .option('-o, --output <name>', 'Output file name. default: output.pdf/output.docx')
      .option('-f, --format <name>', 'File format of the output, can be either "pdf" or "docx". default: pdf')
      .action((opts, args) => {
        let format = opts.format[0] || 'pdf'
        let output = opts.output[0] || 'output.' + format

        if (!VALID_OUTPUT_FORMATS.includes(format)) {
          return reject(Error('Invalid output format'))
        }

        resolve([args.template_file, args.json_data_file, format, output])
      })
    
    return commandpost.exec(commandParser, process.argv)
  })
}
