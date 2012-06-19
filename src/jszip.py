#! /usr/local/bin/python

import os
import re
import sys
import subprocess
import json
import glob
import fnmatch

QUICK_COMPILED_NAME = "otre_client"
COMPILED_NAME = "otre_compiled"

COMPILED_DIR = "compiled"
LIBS_DIR = "libs"

HEADER = "<otre_lib>"
FOOTER = "</otre_lib>"

filelist = [
    "enums",
    "util",
    "precond",
    "logger",
    "handlers",
    "sgf_grammar",
    "stones",
    "newrules",
    "gostone",
    "sgflogic",
    "rutil",
    "themes/themes",
    "themes/std",
    "raphael/otre_raphael",
    "raphael/rutil",
    "raphael/goboard",
    "raphael/actionwindow",
    "raphael/arrow",
    "raphael/qmark",
    "raphael/arrowcirc",
    "raphael/button",
    "raphael/rgostone",
    "raphael/optionstab",
    "raphael/menubar",
    "raphael/simplearrows",
    "display",
    "instance",
    "board_methods"
    ]

# Get the entire list of javascript files, recursively
def get_file_list(path):
  src_matches = []
  lib_matches = []

  libs_reg = re.compile("/" + LIBS_DIR)
  comp_reg = re.compile("/" + COMPILED_DIR)

  head = ""
  for root, dirnames, filenames in os.walk(path):
    if head == "":
      head = root # Grab the first item
    if libs_reg.search(root) != None:
      for fn in fnmatch.filter(filenames, "*.js"):
        lib_matches.append(os.path.join(root, fn).replace(head + "/", ""))

    elif comp_reg.search(root) == None:
      for fn in fnmatch.filter(filenames, "*.js"):
        src_matches.append(os.path.join(root, fn).replace(head + "/", ""))

  file_list = (src_matches, lib_matches)
  print file_list
  sys.exit(0)


def replacer(filename, transform):
  in_file = open(filename, "r")
  in_con = in_file.read()
  in_file.close()

  out_con = transform(in_con)

  out_file = open(filename, "w")
  out_file.write(out_con)
  out_file.close()

def pegjs_trans(cont):
  contents = cont.replace("module.exports", "// <otre_lib>\notre.parser")
  contents += "\n// </otre_lib>"
  return contents

def compile_pegjs():
  pegjs_call = "pegjs rules/sgf_grammar.pegjs"
  out, err = subprocess.Popen(pegjs_call, shell=True).communicate()
  replacer("sgf_grammar.js", pegjs_trans)

def comment_jsimp(cont, fname):
  return cont.replace(
      '<script type="text/javascript" src="%s.js"></script>' % fname,
      '<!-- <script type="text/javascript" src="%s.js"></script> -->' % fname)

def uncomment_jsimp(cont, fname):
  return cont.replace(
      '<!-- <script type="text/javascript" src="%s.js"></script> -->' % fname,
      '<script type="text/javascript" src="%s.js"></script>' % fname)

def godisplay_trans_pre(cont):
  to_uncom = list(filelist)
  to_uncom.append("otre_compiled")
  to_uncom.append("otre_client")
  to_uncom.append("otre")
  for item in to_uncom:
    cont = uncomment_jsimp(cont, item)
  return cont

def godisplay_trans_debug(cont):
  cont = godisplay_trans_pre(cont)
  to_com = ["otre_compiled", "otre_client"]
  for item in to_com:
    cont = comment_jsimp(cont, item)
  return cont

def godisplay_trans_quick(cont):
  cont = godisplay_trans_pre(cont)
  to_com = list(filelist)
  to_com.append("otre_compiled")
  to_com.append("otre")
  for item in to_com:
    cont = comment_jsimp(cont, item)
  return cont

def godisplay_trans_compiled(cont):
  cont = godisplay_trans_pre(cont)
  to_com = list(filelist)
  to_com.append("otre_client")
  to_com.append("otre")
  for item in to_com:
    cont = comment_jsimp(cont, item)
  return cont

def replace_godisplay_debug():
  replacer("GoDisplay.html", godisplay_trans_debug)

def replace_godisplay_quick():
  replacer("GoDisplay.html", godisplay_trans_quick)

def replace_godisplay_compiled():
  replacer("GoDisplay.html", godisplay_trans_compiled)

########
# Main #
########

def main(argv=None):
  thispath = os.path.dirname(os.path.realpath(__file__))
  os.chdir(thispath)

  file_list = get_file_list(thispath)

  compile_pegjs()

  closure_call = ("java -jar /Users/Kashomon/Desktop/CurrentProjects"
      "/libraries/closure.jar --js otre_client.js "
      "--js_output_file otre_compiled.js")

  advanced_closure_call = ("java -jar /Users/Kashomon/Desktop/CurrentProjects"
      "/libraries/closure.jar --compilation_level ADVANCED_OPTIMIZATIONS"
      " --js otre_client.js --js_output_file otre_compiled.js")

  otrefile = open("otre.js", "r");
  otre_contents = otrefile.read().lstrip().rstrip();
  otrefile.close();
  olist = otre_contents.split('\n');
  last = olist.pop()

  total = reduce(lambda x,y: x + '\n' + y, olist)

  otreRegex = re.compile("<otre_lib>((.|\n)*)// </otre_lib>")

  for fname in filelist:
    file = open(fname + ".js", "r")
    contents = file.read()
    file.close();
    found = otreRegex.search(contents).group(1)
    total += found

  total += last

  outfile = open("otre_client.js", "w");
  outfile.write(total);
  outfile.close();

  if len(sys.argv) > 1:
    if sys.argv[1] == "-q":
      print 'finishing quick compile'
      replace_godisplay_quick()
    elif sys.argv[1] == "-d":
      print 'finishing debug compile'
      replace_godisplay_debug()
  else:
    print 'finishing full compile'
    out, err = subprocess.Popen(closure_call, shell=True).communicate()
    replace_godisplay_compiled()

if __name__ == "__main__":
  main()


