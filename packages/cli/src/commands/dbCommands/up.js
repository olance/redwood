import { runCommandTask } from 'src/lib'
import { handler as generatePrismaClient } from 'src/commands/dbCommands/generate'
import {expandSchemaUnsupportedEnvVariables} from "../../lib/expand-schema-env";

export const command = 'up'
export const desc = 'Generate the Prisma client and apply migrations.'
export const builder = {
  verbose: { type: 'boolean', default: true, alias: ['v'] },
  dbClient: { type: 'boolean', default: true },
}

export const handler = async ({ verbose = true, dbClient = true }) => {
  const restoreSchema = expandSchemaUnsupportedEnvVariables()

  try {
    const success = await runCommandTask(
        [
          {
            title: 'Migrate database up...',
            cmd: 'yarn prisma2',
            args: ['migrate up', '--experimental', '--create-db'],
          },
        ],
        { verbose }
    )

    if (success && dbClient) {
      await generatePrismaClient({ force: true, verbose })
    }
  } finally {
    restoreSchema()
  }
}
