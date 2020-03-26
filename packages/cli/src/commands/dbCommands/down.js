import { runCommandTask } from 'src/lib'
import {expandSchemaUnsupportedEnvVariables} from "src/lib/expand-schema-env";

export const command = 'down'
export const desc = 'Migrate your database down.'
export const builder = {
  verbose: { type: 'boolean', default: true, alias: ['v'] },
}
export const handler = async ({ verbose = true }) => {
  const restoreSchema = expandSchemaUnsupportedEnvVariables()

  await runCommandTask(
    [
      {
        title: 'Migrate database down...',
        cmd: 'yarn prisma2',
        args: ['migrate down', '--experimental'],
      },
    ],
    {
      verbose,
    }
  ).finally(restoreSchema)
}
