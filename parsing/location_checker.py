"""Location parsing."""
import re


def findWholeWord(word):
    """Regex to find whole word from string."""
    return re.compile(r'\b({0})\b'.format(word), flags=re.IGNORECASE).search

london_file = '/home/chris/Downloads/city_street_names/london.osm.streets.txt'


def check(word, file_name=london_file):
    """Check for word in London street file."""
    file = open(file_name)
    if findWholeWord(word)(file.read()):
        print True
