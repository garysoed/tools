package(default_visibility = ["//:internal"])

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

test_suite(
    name = "test",
    tests = [
      "//src/async:test",
      "//src/collection:test",
      "//src/data:test",
      "//src/dispose:test",
      "//src/event:test",
      "//src/inject:test",
      "//src/mock:test",
      "//src/net:test",
      "//src/ng:test",
      "//src/pipeline:test",
      "//src/secure:test",
      "//src/testing:test",
      "//src/typescript:test",
      "//src/ui:test",
      "//src/valid:test",
      "//src/webc:test",
    ]
)

filegroup(
    name = "tslint_config",
    srcs = ["tslint.json"]
)