import mmap


def check(blabla):
    """Check for blabla in London street file."""
    f = open('/home/chris/Downloads/city_street_names/london.osm.streets.txt')
    s = mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ)
    if s.find('blabla') != -1:
        return 'true'
