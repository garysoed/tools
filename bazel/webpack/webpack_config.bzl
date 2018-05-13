WebpackConfig = provider(fields=["entry", "config"])

def _webpack_config_impl(ctx):
  output_name = "%s.bundle.js" % (ctx.file.entry.basename)
  ctx.actions.expand_template(
      template = ctx.file._template,
      output = ctx.outputs.webpack_config,
      substitutions = {
          "{ENTRY}": ctx.file.entry.path,
          "{OUTPUT}": output_name,
      }
  )
  return [WebpackConfig(
    entry = ctx.file.entry,
    config = ctx.outputs.webpack_config)]

webpack_config = rule(
    implementation = _webpack_config_impl,
    attrs = {
      "entry": attr.label(
          allow_single_file = True,
          mandatory = True),
      "webpack_config": attr.output(
          mandatory = True,
      ),
      "_template": attr.label(
          default = Label("//bazel/webpack:webpack_config_js_template"),
          single_file = True,
      ),
    },
)