import { generateTypes } from '../node_modules/payload/dist/bin/generateTypes.js'
import config from '../payload.config'

async function main() {
  await generateTypes(await config)
}

void main()
