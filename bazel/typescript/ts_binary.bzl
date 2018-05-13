load("//bazel/webpack:webpack_config.bzl", "WebpackConfig")
load("//bazel/typescript:ts_config.bzl", "TsConfig")
load("//bazel/typescript:ts_library.bzl", "TsFiles")

def _ts_binary_impl(ctx):
  input_files = [ctx.attr.webpack_config[WebpackConfig].config]
  input_files += [ctx.attr.ts_config[TsConfig].config]
  for ts_file in ctx.attr.ts_files:
    for file in ts_file[TsFiles].files:
      input_files += [file]

  ctx.actions.run_shell(
      outputs = [ctx.outputs.bundle, ctx.outputs.map],
      inputs = input_files,
      command = "webpack",
      env = {
        "EXTRA_NODE_PATH": './' + ctx.bin_dir.path + ":./" + ctx.genfiles_dir.path,
      },
      tools = [ctx.]
  )


ts_binary = rule(
    implementation = _ts_binary_impl,
    attrs = {
      "bundle": attr.output(
          mandatory = True,
      ),
      "map": attr.output(
          mandatory = True,
      ),
      "webpack_config": attr.label(
          allow_files = False,
          mandatory = True,
          providers = [WebpackConfig],
      ),
      "ts_config": attr.label(
          allow_files = False,
          mandatory = True,
          providers = [TsConfig],
      ),
      "ts_files": attr.label_list(
          allow_files = False,
          mandatory = True,
          non_empty = False,
          providers = [TsFiles])
    },
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
