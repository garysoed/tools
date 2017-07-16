package(default_visibility = ["//visibility:public"])

load("//:defs.bzl", "gs_tools")

gs_tools(
    deps = [
      "//src/dispose",
      "//src/event",
      "//src/inject",
    ])

filegroup(
    name = "mock_angular",
    srcs = ["mock-angular.js"]
)
