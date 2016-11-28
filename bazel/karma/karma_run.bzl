def _karma_run_impl(ctx):
  target_name = str(ctx).split(':')[-1]
  config_file = ctx.new_file('%s_karma.config.js' % target_name)

  path_to_root = '/'.join(['..' for part in ctx.build_file_path.split('/')[:-1]])
  if path_to_root == '':
    path_to_root = '.'

  file_configs = []
  # deps must all come before the srcs
  for f in ctx.files.deps + ctx.files.srcs:
    file_configs.append('{pattern: "%s", included: true}' % (path_to_root + '/' + f.short_path))

  ctx.template_action(
      output = config_file,
      substitutions = {
        '$files$': ',\n'.join(file_configs),
        '$single_run$': 'false',
      },
      template = ctx.file._config_template,
  )

  ctx.file_action(
      output = ctx.outputs.executable,
      content = '%s start %s' % ('karma', config_file.short_path)
  )

  runfiles = ctx.runfiles(
      files = [ctx.executable._karma_bin, config_file] + ctx.files.srcs + ctx.files.deps
  )
  return struct(runfiles = runfiles)


karma_run = rule(
    attrs = {
      "srcs": attr.label_list(
          allow_files = FileType([".js"]),
          mandatory = True,
          non_empty = True),
      "deps": attr.label_list(
          allow_files = FileType([".js"])),
      "_config_template": attr.label(
          default = Label("//bazel/karma:config_template"),
          single_file = True),
      "_karma_bin": attr.label(
          cfg = "host",
          default = Label("@karma//:karma"),
          executable = True,
          single_file = True),
    },
    implementation = _karma_run_impl,
    executable = True,
)
"""Runs karma server on the given test files.

This rule runs a karma server on a continuous run on the given test files.

Args:
  deps: List of test .js files. Note that these .js files have to be in the
      same directory as this target.
"""
