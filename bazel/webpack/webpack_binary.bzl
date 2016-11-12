def _webpack_binary_impl(ctx):
  target_name = str(ctx).split(':')[-1]
  tarfile = ctx.file.package.path
  tardir = ctx.file.package.basename[:-4]

  config_file = ctx.new_file('%s_webpack.config.js' % target_name)
  ctx.template_action(
      output = config_file,
      substitutions = {
        '$root$': tardir,
      },
      template = ctx.file._config_template,
  )

  ctx.action(
      command = "tar xf %s && %s %s %s --hide-modules --config %s" % (
        tarfile,
        ctx.executable._webpack_bin.path,
        tardir + '/' + ctx.attr.entry,
        ctx.outputs.out.path,
        config_file.path),
      execution_requirements = {
        "exclusive": "True"
      },
      inputs = [ctx.file.package, config_file],
      outputs = [ctx.outputs.out],
      progress_message = 'Extracting srcs and running webpack with %s' % (ctx.outputs.out.path),
      use_default_shell_env = True)

webpack_binary = rule(
    implementation = _webpack_binary_impl,
    attrs = {
      "entry": attr.string(
          mandatory = True,
      ),
      "package": attr.label(
          allow_files = FileType(['.tar']),
          mandatory = True,
          single_file = True),
      "_config_template": attr.label(
          default = Label("//bazel/webpack:config_template"),
          single_file = True),
      "_webpack_bin": attr.label(
          default = Label("@webpack//:webpack"),
          executable = True,
          single_file = True)
    },
    outputs = {
      "out": "%{name}.js"
    }
)
"""Packs the given `.tar` file into a single js file using web pack.

Uses webpack to pack the files in the given `.tar` file into a single `.js` file.

Args:
  entry: The entry file for webpack to start from. This is the path to the entry file relative to
      the workspace root.
  package: `.tar` file containing all the files to be packed together.

Outputs:
  {name}.js: The packed javascript file.
"""
