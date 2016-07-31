"""Location parsing."""
import re


def findWholeWord(w):
    """Regex to find whole word from string."""
    return re.compile(r'\b({0})\b'.format(w), flags=re.IGNORECASE).search


def check(blabla):
    """Check for blabla in London street file."""
    file = open(
        '/home/chris/Downloads/city_street_names/london.osm.streets.txt')
    if findWholeWord(blabla)(file.read()):
        print True
