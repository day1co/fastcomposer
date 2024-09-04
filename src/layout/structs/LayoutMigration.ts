type LayoutMigration = {
  name: string
  options: any
  // TODO fix type of options (was typeof this.options)
  requires(options, layout, values): boolean
  migrate(options, layout, values): any
}

export default LayoutMigration
