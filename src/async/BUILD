package(default_visibility = ["//visibility:public"])

# load("//:defs.bzl", "gs_tools")

# gs_tools(
#     deps = [
#       "//src/error",
#       "//src/event",
#     ])

load("//bazel/typescript:defs.bzl", "ts_config", "ts_binary", "ts_library")

ts_library(
    name = "async",
    srcs = native.glob(["*.ts"]),
)

ts_config(
    name = "tsconfig",
    ts_files = [":async"],
    ts_config = "ts_config.json",
)

load("//bazel/webpack:defs.bzl", "webpack_config")

webpack_config(
    name = "webpackconfig",
    entry = "atomic_test.ts",
    webpack_config = "webpack.config.js",
)

ts_binary(
    name = "bin",
    bundle = "bundle.js",
    map = "bundle.js.map",
    webpack_config = ":webpackconfig",
    ts_config = ":tsconfig",
    ts_files = [":async"]
)
