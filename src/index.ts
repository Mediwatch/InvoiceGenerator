import { getArgs } from './getArgs'
import { generateInvoice } from './generateInvoice'

async function main() {
  try {
    const args = await getArgs()
    await generateInvoice(args)
  } catch (e) {
    console.log(e.message)
  }
}

main()
