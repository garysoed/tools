package(default_visibility = ["//:internal"])

load("//bazel/karma:defs.bzl", "karma_run")
load("//bazel/webc:defs.bzl", "webc_gen_template")

webc_gen_template(
    name = "template",
    css = "css.css",
    template = "html.html",
    key = "key",
)

package_group(
    name = "internal",
    packages = ["//..."]
)

karma_run(
    name = "test",
    srcs = [
        "//src/async:test_src",
        "//src/check:test_src",
        "//src/collection:test_src",
        "//src/color:test_src",
        "//src/data:test_src",
        "//src/dispose:test_src",
        "//src/event:test_src",
        "//src/inject:test_src",
        "//src/jasmine:test_src",
        "//src/net:test_src",
        "//src/parse:test_src",
        "//src/pipeline:test_src",
        "//src/random:test_src",
        "//src/rpc:test_src",
        "//src/secure:test_src",
        "//src/solver:test_src",
        "//src/store:test_src",
        "//src/string:test_src",
        "//src/typescript:test_src",
        "//src/ui:test_src",
        "//src/util:test_src",
        "//src/webc:test_src",
    ]
)

test_suite(
    name = "lint",
    tests = [
      "//src/async:lint",
      "//src/check:lint",
      "//src/collection:lint",
      "//src/color:lint",
      "//src/data:lint",
      "//src/dispose:lint",
      "//src/event:lint",
      "//src/inject:lint",
      "//src/interfaces:lint",
      "//src/jasmine:lint",
      "//src/mock:lint",
      "//src/net:lint",
      "//src/parse:lint",
      "//src/pipeline:lint",
      "//src/random:lint",
      "//src/rpc:lint",
      "//src/secure:lint",
      "//src/solver:lint",
      "//src/store:lint",
      "//src/string:lint",
      "//src/testing:lint",
      "//src/typescript:lint",
      "//src/ui:lint",
      "//src/util:lint",
      "//src/webc:lint",
    ]
)

filegroup(
    name = "tslint_config",
    srcs = ["tslint.json"]
)
