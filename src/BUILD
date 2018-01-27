package(default_visibility = ["//visibility:public"])

load("//:defs.bzl", "gs_tools")
load("//bazel/typescript:defs.bzl", "ts_library")

gs_tools(
    deps = [
      "//src/color",
      "//src/datamodel",
      "//src/dispose",
      "//src/graph",
      "//src/immutable",
      "//src/inject",
      "//src/interfaces",
      "//src/jasmine",
      "//src/mock",
      "//src/net",
      "//src/path",
      "//src/path/testing",
      "//src/parse",
      "//src/persona",
      "//src/random",
      "//src/rpc",
      "//src/secure",
      "//src/solver",
      "//src/store",
      "//src/string",
      "//src/testing",
      "//src/typescript",
      "//src/ui",
      "//src/util",
      "//src/webc",
    ])

ts_library(
    name = "test_base",
    srcs = ["test-base.ts"],
    deps = [
      "//src/jasmine",
      "//src/path/testing",
      "//src/testing",
    ],
)