def _ts_library_impl(ctx):
  files = set()
  files += ctx.files.srcs

  # Add the dependencies
  for dep in ctx.attr.deps:
    files += dep.ts_files

  return struct(ts_files = files)

#
# Abstraction of a set of typescript files and their dependencies.
#
ts_library = rule(
    attrs = {
      "srcs": attr.label_list(
          allow_files = FileType([".ts"])),
      "deps": attr.label_list(
          allow_files = False,
          default = [],
          providers = ["ts_files"])
    },
    implementation = _ts_library_impl
)
"""Collects typescript files.

Collect typescript files to be compiled by `ts_library`.

Args:
  srcs: A list of targets with file extension `.ts`.
  deps: A list of `ts_library` targets that the files in `srcs` depend on.
"""