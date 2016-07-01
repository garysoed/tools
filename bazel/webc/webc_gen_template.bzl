def _webc_gen_template(ctx):
  #processed_template_file = ctx.new_file("processed_template.html")
  print(ctx.files._compile_template_bin)
  ctx.action(
      outputs = [ctx.outputs.js],
      command = "python %s %s %s %s %s" % (
          ctx.files._compile_template_bin[0].path,
          ctx.file.template.path,
          ctx.file.css.path,
          ctx.attr.key,
          ctx.outputs.js.path,
      ),
      inputs = ctx.files._compile_template_bin + [ctx.file.css, ctx.file.template],
      use_default_shell_env = True,
  )

webc_gen_template = rule(
    attrs = {
      "css": attr.label(
          allow_files = FileType([".css"]),
          single_file = True,
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
