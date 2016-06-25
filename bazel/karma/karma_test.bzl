def _karma_test_impl(ctx):
  config_template = ctx.file._config_template
  deps = ctx.files.deps
  exec_output = ctx.outputs.executable
  karma_bin = ctx.executable._karma_bin

  config_file = ctx.new_file('karma.config.js')

  ctx.template_action(
      output = config_file,
      substitutions = {
        '$files$': '{pattern: "*.js", included: true}',
        '$single_run$': 'true',
      },
      template = config_template,
  )

  ctx.file_action(
      output = ctx.outputs.executable,
      content = '%s start %s' % (karma_bin.path, config_file.short_path)
  )

  runfiles = ctx.runfiles(
      files = [karma_bin, config_file] + deps
  )
  return struct(runfiles = runfiles)


karma_test = rule(
    attrs = {
      "deps": attr.label_list(
          allow_files = FileType([".js"]),
          mandatory = True,
          non_empty = True),
      "_config_template": attr.label(
          default = Label("//bazel/karma:config_template"),
          single_file = True),
      "_karma_bin": attr.label(
          default = Label("@karma//:karma"),
          executable = True,
          single_file = True),
    },
    implementation = _karma_test_impl,
    test = True,
)
"""Runs karma server on the given test files.

This rule runs a karma server on a single run on the given test files.

Args:
  deps: List of test .js files. Note that these .js files have to be in the
      same directory as this target.
"""
