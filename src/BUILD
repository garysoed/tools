package(default_visibility = ["//visibility:public"])

load("//:defs.bzl", "gs_tools")
load("//bazel/ts:defs.bzl", "ts_library")

gs_tools(
    deps = [
      "//src/collection",
      "//src/color",
      "//src/dispose",
      "//src/inject",
      "//src/jasmine",
      "//src/mock",
      "//src/net",
      "//src/secure",
      "//src/solver",
      "//src/string",
      "//src/testing",
      "//src/typescript",
      "//src/ui",
      "//src/util",
      "//src/valid",
      "//src/webc",
    ])

ts_library(
    name = "test_base",
    srcs = ["test-base.ts"],
    deps = [
      "//src/jasmine",
      "//src/testing",
    ],
)