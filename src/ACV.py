from struct import unpack_from, calcsize
from scipy.interpolate import interp1d as interpolate

class ACV(object):
	def __init__(self, buf):
		self.buf = buf
		self.off = 0
		self.curves = []
		self.precomputed = []
		self.load()

	def read(self, fmt):
		result = unpack_from(fmt, self.buf, self.off)
		self.off += calcsize(fmt);
		return result;

	def loadcurve(self):
		result = []
		(point_count,) = self.read(">h")
		for p in range(0, point_count):
			y,x = self.read(">hh")
			result.append((x,y))
		return result
	
	def load(self):
		(magic,curve_count)=self.read(">hh")
		for i in range(0, curve_count):
			self.curves.append(self.loadcurve())
		for c in self.curves:
			x = [v[0] for v in c]
			y = [v[1] for v in c]
			if(len(x) > 2):
				f = interpolate(x, y, kind='cubic')
			else:
				f = interpolate(x, y)
			sweep = xrange(0,256)
			values = [int(round(v)) for v in f(xrange(0,256))]
			self.precomputed.append(zip(sweep, values))

	def __repr__(self):
		return "Adobe Curve <%d channels>" % (len(self.curves))
