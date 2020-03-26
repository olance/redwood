import fs from 'fs'

export const expandSchemaUnsupportedEnvVariables = (schemaPath) => {
  // Get Prisma's schema file content
  const schemaOriginalContents = fs.readFileSync(schemaPath, 'utf-8')
  let expandedSchema = schemaOriginalContents

  // Find calls to `env()` in datasources & generator provider values
  let matches = expandedSchema.matchAll(
    /(?<lead>(?:datasource|generator)[^}]+provider[^=]*=\W+)(?<env_call>env\(["'](?<variable>[^"']*)["']\))/gm
  )
  matches = Array.from(matches).reverse()

  for (const match of matches) {
    // Replace each match with the actual environment value
    expandedSchema =
      expandedSchema.slice(0, match.index + match.groups.lead.length) +
      '"' +
      process.env[match.groups.variable] +
      '"' +
      expandedSchema.slice(match.index + match[0].length)
  }

  // Write newly expanded content to the schema file
  fs.writeFileSync(schemaPath, expandedSchema)

  return () => {
    fs.writeFileSync(schemaPath, schemaOriginalContents)
  }
}
