import * as fs from 'fs'

export function readFileAsync(path: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, content) => {
      if (err) {
        return reject(err)
      }

      resolve(content)
    })
  })
}
