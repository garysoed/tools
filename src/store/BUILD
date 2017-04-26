package(default_visibility = ["//visibility:public"])

load("//:defs.bzl", "gs_tools")

gs_tools(
    deps = [
      "//src/async",
      "//src/data",
      "//src/dispose",
      "//src/event",
      "//src/inject",
      "//src/random",
    ])

filegroup(
    name = "mock_angular",
    srcs = ["mock-angular.js"]
)
