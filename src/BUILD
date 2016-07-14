package(default_visibility = ["//visibility:public"])

load("//:defs.bzl", "gs_tools")
load("//bazel/ts:defs.bzl", "ts_library")

gs_tools(
    deps = [
      "//src/collection",
      "//src/color",
      "//src/inject",
      "//src/mock",
      "//src/solver",
      "//src/testing",
      "//src/util",
      "//src/valid",
      "//src/webc",
    ])

ts_library(
    name = "test_base",
    srcs = ["test-base.ts"],
    deps = [
      "//src/testing",
    ],
)