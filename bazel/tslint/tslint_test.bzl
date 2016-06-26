def _tslint_test_impl(ctx):
  file_paths = " ".join([f.path for f in ctx.files.srcs])
  command = "%s -c %s %s" % (
      ctx.executable._tslint_bin.path,
      ctx.file.config.path,
      file_paths)
  ctx.file_action(
      content = command,
      executable = True,
      output = ctx.outputs.executable,
  )

  runfiles = ctx.runfiles(
      files = [ctx.executable._tslint_bin, ctx.file.config] + ctx.files.srcs
  )
  return struct(runfiles = runfiles)

tslint_test = rule(
    attrs = {
      "srcs": attr.label_list(
          allow_files = FileType([".ts"]),
          mandatory = True,
      ),
      "config": attr.label(
          allow_files = FileType([".json"]),
          single_file = True,
      ),
      "_tslint_bin": attr.label(
          default = Label("@tslint//:tslint"),
          executable = True,
          single_file = True,
      )
    },
    implementation = _tslint_test_impl,
    test = True,
)
