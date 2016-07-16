import sys

template_file = open(sys.argv[1], "r")

lines = []
if len(sys.argv) > 4:
  css_file = open(sys.argv[4], "r")

  lines.append("<style>\n")
  for css_line in css_file:
    lines.append("  " + css_line)
  lines.append("</style>\n")

for template_line in template_file:
  lines.append(template_line)

formatted_lines = []
for line in lines:
  formatted_line = "    '%s'" % line.replace('\n', '\\n').replace('\'', '\\\'')
  formatted_lines.append(formatted_line)
template_str = " + \n".join(formatted_lines)
template_full = "gs.Templates.register('%s',\n%s);" % (sys.argv[2], template_str)

out_file = open(sys.argv[3], "w")
out_file.write(template_full)
