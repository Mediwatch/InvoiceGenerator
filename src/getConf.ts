import * as fs from 'fs'

function readFileAsync(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, content) => {
      if (err) {
        return reject(err)
      }

      resolve(content.toString())
    })
  })
}

export async function getConf(): Promise<object> {
  let confPath = './config.json'

  if (process.argv.length > 2) {
    confPath = process.argv[2]
  }

  const conf = await readFileAsync(confPath)

  return JSON.parse(conf)
}
