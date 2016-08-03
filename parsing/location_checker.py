"""Location parsing."""
import re
import geocoder
from os import listdir
from os.path import isfile, join
import os
import csv
import argparse

mydir = os.path.dirname(__file__)

def findWholeWord(word):
    """Regex to find whole word from string."""
    return re.compile(r'\b({0})\b'.format(word), flags=re.IGNORECASE).search

# required for running it from node
LONDON_STREETS = os.path.abspath(os.path.join(mydir,'london.osm.streets.txt'))
LOCAL_TOWN = 'London'


def check(word, file_name=LONDON_STREETS):
    """Check for word in London street file."""
    with open(file_name) as f:
        if findWholeWord(word)(f.read()):
            return word


def get_lat_long(place_string):
    """Geocoder service to receive lat long for places."""
    g = geocoder.google(place_string + " " + LOCAL_TOWN)
    if g.status == 'OK':
        return g.latlng
    else:
        return None


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


def get_first_valid_address(input):
    for word in input.split():
        result = check(word)
        if result is not None:
            return result
    return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("text", help="Location recognition with regex", nargs="*")
    args = parser.parse_args()

    valid_address = get_first_valid_address(args.text[0])
    if valid_address is not None:
        coords = get_lat_long(valid_address)
        if coords is not None:
            print valid_address
            print coords[0]
            print coords[1]
