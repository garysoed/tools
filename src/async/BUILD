package(default_visibility = ["//visibility:public"])

load("//bazel/karma:defs.bzl", "karma_run", "karma_test")
load("//bazel/ts:defs.bzl", "ts_binary", "ts_library")
load("//bazel/webpack:defs.bzl", "webpack_binary")

ts_library(
    name = "async",
    srcs = ["interval.ts"],
    deps = ["//declarations"]
)

ts_binary(
    name = "async_bin",
    deps = [":async"],
)

webpack_binary(
    name = "async_pack",
    package = ":async_bin",
    entry = "src/async/interval.js"
)



ts_library(
    name = "async_test",
    srcs = ["interval_test.ts"],
    deps = [":async"],
)

ts_binary(
    name = "async_test_bin",
    deps = [":async_test"]
)

webpack_binary(
    name = "async_test_pack",
    package = ":async_test_bin",
    entry = "src/async/interval_test.js"
)

karma_run(
    name  = "karma_test_run",
    deps = [":async_test_pack"],
)

karma_test(
    name = "test",
    deps = [":async_test_pack"]
)
