package(default_visibility = ["//:internal"])

load("//bazel/ts:defs.bzl", "ts_library")


ts_library(
    name = "declarations",
    srcs = [
      "@typescript//:es6",
      "gs-tools.d.ts"
    ],
    deps = [
      "//declarations/jasmine"
    ]
)
