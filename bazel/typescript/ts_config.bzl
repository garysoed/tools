load("//bazel/typescript:ts_library.bzl", "TsFiles")

TsConfig = provider(fields = ["config"])

def _ts_config_impl(ctx):
  file_paths = []
  print(ctx.attr.ts_files)
  for ts_file in ctx.attr.ts_files:
    for file in ts_file[TsFiles].files:
      file_paths += [("\"%s\"" % file.path)]

  ctx.actions.expand_template(
      template = ctx.file._template,
      output = ctx.outputs.ts_config,
      substitutions = {
          "{INCLUDES}": ",\n".join(file_paths)
      }
  )

  return TsConfig(config = ctx.outputs.ts_config)

ts_config = rule(
    implementation = _ts_config_impl,
    attrs = {
      "ts_files": attr.label_list(
          allow_files = False,
          mandatory = True,
          non_empty = False,
          providers = [TsFiles]),
      "ts_config": attr.output(
          mandatory = True,
      ),
      "_template": attr.label(
          default = Label("//bazel/typescript:tsconfig_json_template"),
          single_file = True,
      ),
    },
)