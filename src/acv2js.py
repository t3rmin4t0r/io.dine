from sys import argv, stdout, stdin
from ACV import ACVReader
from getopt import getopt
import json

def main(args):
	opts,args = getopt(args,'o:')
	_out = stdout
	_in = stdin
	for (k,v) in opts:
		if k == '-o':
			_out = open(v,"w")
	if args:
		_in = open(args.pop(), "r")
	
	acv = ACVReader(_in.read())
	obj = {"AdobeCurve":True, "curves":acv.precomputed}
	output = json.dumps(obj)
	_out.write(output)


main(argv[1:])
