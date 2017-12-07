package(default_visibility = ["//visibility:public"])

load("//:defs.bzl", "gs_tools")

gs_tools(
    deps = [
      "//src/async",
      "//src/dispose",
      "//src/event",
      "//src/inject",
      "//src/net",
      "//src/random",
    ])

filegroup(
    name = "mock_angular",
    srcs = ["mock-angular.js"]
)
