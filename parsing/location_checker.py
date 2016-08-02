"""Location parsing."""
import re
import geocoder
from os import listdir
from os.path import isfile, join
import os
import csv

def findWholeWord(word):
    """Regex to find whole word from string."""
    return re.compile(r'\b({0})\b'.format(word), flags=re.IGNORECASE).search

london_file = '/home/chris/Downloads/city_street_names/london.osm.streets.txt'


def check(word, file_name=london_file):
    """Check for word in London street file."""
    with open(file_name) as f:
        if findWholeWord(word)(f.read()):
            print True, word
            return True


def get_lat_long(place_string):
    """Geocoder service to receive lat long for places."""
    g = geocoder.google(place_string)
    if g.status == 'OK':
        print g.latlng

mydir = os.path.dirname(__file__)
DATA_DIR = os.path.abspath(os.path.join(mydir, 'opname_csv_gb/DATA'))


def find_csvs(word):
    data_files = [f for f in listdir(DATA_DIR) if isfile(join(DATA_DIR, f))]
    london_files = [f for f in data_files if "TQ" in f] # TQ code for London
    for file_name in london_files:
        with open(os.path.abspath(os.path.join(DATA_DIR, file_name))) as f:
            reader = csv.reader(f)
            for row in reader:
                for column in row:
                    if findWholeWord(word)(column):
                        print row
    return "TT_TT"
