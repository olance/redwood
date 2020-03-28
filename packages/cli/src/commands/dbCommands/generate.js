import path from 'path'

import { runCommandTask, getPaths } from 'src/lib'
import { expandSchemaUnsupportedEnvVariables } from "src/lib/expand-schema-env";

export const command = 'generate'
export const desc = 'Generate the Prisma client.'
export const builder = {
  verbose: { type: 'boolean', default: true, alias: ['v'] },
  force: { type: 'boolean', default: true, alias: ['f'] },
}
export const handler = async ({ verbose = true, force = true }) => {
  // Do not generate the Prisma client if it exists.
  if (!force) {
    // The Prisma client throws if it is not generated.
    try {
      // Import the client from the redwood apps node_modules path.
      const { PrismaClient } = require(path.join(
        getPaths().base,
        'node_modules/@prisma/client'
      ))
      // eslint-disable-next-line
      new PrismaClient()
      return undefined
    } catch (e) {
      // Swallow your pain.
    }
  }

  const restoreSchema = expandSchemaUnsupportedEnvVariables()

  return await runCommandTask(
    [
      {
        title: 'Generating the Prisma client...',
        cmd: 'yarn prisma2',
        args: ['generate'],
      },
    ],
    {
      verbose,
    }
  ).finally(restoreSchema)
}
