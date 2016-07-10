load("//bazel/karma:defs.bzl", "karma_run", "karma_test")
load("//bazel/ts:defs.bzl", "ts_binary", "ts_library")
load("//bazel/tslint:defs.bzl", "tslint_test")
load("//bazel/webpack:defs.bzl", "webpack_binary")

def gs_tools(deps = [], test_deps = []):
  """Generic bazel target for all packages in gs-tools.

  Generates some default targets for gs-tools.

  Args:
    deps: Array of `ts_library` targets that the source files in this package depend on.
    test_deps: Array of `ts_library` targets that the tests in this package depend on.

  Generated targets:
    test: A `test_suite` containing all the tests in this directory.
    test_run: A `karma_run` target that runs a continuously running server on all test files in
        this directory.

    Assuming that the BUILD file is located under directory `dir`:
      {dir}: A `ts_library` target that packs together all production files.
      {dir}_bin: A `ts_binary` target that compiles all the production files into a `.tar` file.
      {dir}_test: A `ts_library` target that packs all the test files.

    For every test file called `test.ts`:
      {test}_bin: A `ts_binary` target that compiles the test file and all its dependencies into a
          `.tar` file.
      {test}_pack: A `webpack_binary` target that packs `test.js` and all its dependencies into a
          single `.js` file.
      {test}: A `karma_test` target that runs the tests in `test.ts`.
      {test}_run: A `karma_run` target that runs a continuously running server on tests defined by
          `test.ts`.
  """

  lib_name = PACKAGE_NAME.split("/")[-1]
  bin_name = lib_name + "_bin"

  testlib_name = lib_name + "_test"
  testbin_name = testlib_name + "_bin"

  # Prod files.
  ts_library(
      name = lib_name,
      srcs = native.glob(["*.ts"]),
      deps = ["//declarations"] + deps
  )

  ts_binary(
      name = bin_name,
      deps = [":" + lib_name],
  )

  # Test files.
  test_srcs = native.glob(["*_test.ts"])
  ts_library(
      name = testlib_name,
      srcs = test_srcs,
      deps = [":" + lib_name],
  )

  # Generates a pack, karma run, and karma test file for every test.
  test_src_pack_labels = []
  test_targets = []
  for test_src in test_srcs:
    test_src_name = test_src[:-3]
    test_src_bin_name = "%s_bin" % test_src_name
    test_src_pack_name = "%s_pack" % test_src_name
    test_src_pack_label = ":" + test_src_pack_name

    ts_binary(
        name = test_src_bin_name,
        deps = [":" + testlib_name]
    )

    webpack_binary(
        name = test_src_pack_name,
        package = ":" + test_src_bin_name,
        entry = "%s/%s.js" % (PACKAGE_NAME, test_src[:-3]),
    )

    karma_test(
        name = test_src_name,
        srcs = [test_src_pack_label],
        deps = test_deps,
        size = "small",
    )

    karma_run(
        name = "%s_run" % test_src_name,
        srcs = [test_src_pack_label],
        deps = test_deps,
    )

    test_src_pack_labels.append(test_src_pack_label)
    test_targets.append(test_src_name);

  tslint_test(
      name = "lint",
      srcs = native.glob(["*.ts"]),
      config = "//:tslint_config"
  )

  tests = [":lint"]
  if len(test_src_pack_labels) > 0:
    karma_run(
        name = "test_run",
        srcs = test_src_pack_labels,
        deps = test_deps,
    )

    karma_test(
        name = "all_test",
        srcs = test_src_pack_labels,
        deps = test_deps,
        size = "small"
    )

    tests.append(":all_test")

  native.test_suite(
      name = "test",
      tests = tests
  )
