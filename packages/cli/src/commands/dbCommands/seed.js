import { getPaths, runCommandTask } from 'src/lib'
import { expandSchemaUnsupportedEnvVariables } from "../../lib/expand-schema-env";

export const command = 'seed'
export const desc = 'Seed your database with test data.'
export const handler = () => {
  const restoreSchema = expandSchemaUnsupportedEnvVariables()

  runCommandTask(
    [
      {
        title: 'Seeding your database...',
        cmd: 'node',
        args: ['seeds.js'],
        opts: { cwd: getPaths().api.db },
      },
    ],
    { verbose: true }
  ).finally(restoreSchema)
}
