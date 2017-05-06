def _ts_binary_impl(ctx):
  files = set()
  files += ctx.files.deps

  # Add the dependencies
  for dep in ctx.attr.deps:
    files += dep.ts_files

  # Compile the ts files
  paths = ' '.join([f.path for f in files])

  compile_command = ' '.join([
    'tsc',
    '--baseUrl', '.',
    '--experimentalDecorators',
    '--module', 'commonjs',
    '--outDir', ctx.label.name,
    '--rootDir', '.',
    '--noResolve',
    '--pretty',
    '--moduleResolution', 'classic',
    '--strictNullChecks',
    '--target', ctx.attr.ts_target,
    paths
  ])
  tar_command = 'tar cf %s %s' % (ctx.outputs.out.path, ctx.label.name)

  ctx.action(
      command = "%s && %s" % (compile_command, tar_command),
      inputs = list(files),
      mnemonic = "CompilingTypescriptFiles",
      outputs = [ctx.outputs.out],
      progress_message = "Compiling Typescript Files",
      use_default_shell_env = True)


ts_binary = rule(
    implementation = _ts_binary_impl,
    attrs = {
      "deps": attr.label_list(
          allow_files = False,
          mandatory = True,
          non_empty = True,
          providers = ["ts_files"]),
      "ts_target": attr.string(
          default = "ES2015",
          values = ["ES3", "ES5", "ES2015"]),
      "_ts_bin": attr.label(
          cfg = "host",
          default = Label("@typescript//:tsc"),
          executable = True,
          single_file = True),
      "_ts_lib": attr.label(
          default = Label("@typescript//:tsc_lib"),
          single_file = True)
    },
    outputs = {
      "out": "%{name}.tar"
    }
)
"""Compiles the given `ts_library` targets.

This rule compiles the given ts_library targets into a tar of `.js` files.

Args:
  deps: A list of `ts_library` targets to be compiled.
  ts_target: Target to compile the typescript files to. Can be ES3, ES5, or ES2015.
      Defaults to ES5.

Outputs:
  {name}.tar: tar containing all the compiled `.js` files.
"""
