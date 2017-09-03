package(default_visibility = ["//visibility:public"])

load("//:defs.bzl", "gs_tools")

# Rely on transitive dependencies to avoid cyclic dependencies.
gs_tools(
    deps = [
        "//src/async",
        "//src/dispose",
        "//src/event",
        "//src/inject",
    ])
