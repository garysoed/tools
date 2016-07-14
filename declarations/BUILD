package(default_visibility = ["//:internal"])

load("//bazel/ts:defs.bzl", "ts_library")


ts_library(
    name = "declarations",
    srcs = glob(['*.d.ts']) + [
      "@typescript//:es6",
    ],
    deps = [
      "//declarations/angularjs",
      "//declarations/grecaptcha",
      "//declarations/jasmine",
      "//declarations/jasmine-ajax:jasmine_ajax",
      "//declarations/jquery",
    ]
)
