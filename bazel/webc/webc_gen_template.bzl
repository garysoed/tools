def _webc_gen_template(ctx):
  css_file = None
  for f in ctx.files.css:
    if f.path[-4:] == ".css":
      css_file = f

  ctx.action(
      outputs = [ctx.outputs.js],
      command = "python %s %s %s %s %s" % (
          ctx.files._compile_template_bin[0].path,
          ctx.file.template.path,
          css_file.path,
          ctx.attr.key,
          ctx.outputs.js.path,
      ),
      inputs = ctx.files._compile_template_bin + [css_file, ctx.file.template],
      use_default_shell_env = True,
  )

webc_gen_template = rule(
    attrs = {
      "css": attr.label(
          allow_files = FileType([".css"]),
      ),
      "key": attr.string(
          mandatory = True,
      ),
      "template": attr.label(
          allow_files = FileType([".html"]),
          mandatory = True,
          single_file = True,
      ),
      "_compile_template_bin": attr.label(
          default = Label("//bazel/webc:compile_template"),
      )
    },
    implementation = _webc_gen_template,
    outputs = {
      "js": "%{name}.js"
    },
)
