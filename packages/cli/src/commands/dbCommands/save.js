import { runCommandTask } from 'src/lib'
import { expandSchemaUnsupportedEnvVariables } from "../../lib/expand-schema-env";

export const command = 'save [name..]'
export const desc = 'Create a new migration.'
export const builder = {
  verbose: { type: 'boolean', default: true, alias: ['v'] },
}
export const handler = async ({ name, verbose = true }) => {
  const restoreSchema = expandSchemaUnsupportedEnvVariables()

  await runCommandTask(
    [
      {
        title: 'Creating database migration...',
        cmd: 'yarn prisma2',
        args: [
          'migrate save',
          name && `--name ${name}`,
          '--experimental',
        ].filter(Boolean),
      },
    ],
    {
      verbose,
    }
  ).finally(restoreSchema)
}
