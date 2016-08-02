"""Location parsing."""
import re
import geocoder
import argparse


def findWholeWord(word):
    """Regex to find whole word from string."""
    return re.compile(r'\b({0})\b'.format(word), flags=re.IGNORECASE).search

# required for running it from node
LONDON_STREETS = '../parsing/london.osm.streets.txt'
LOCAL_TOWN = 'London'


def check(word, file_name=LONDON_STREETS):
    """Check for word in London street file."""
    file = open(file_name)
    if findWholeWord(word)(file.read()):
        return word


def get_lat_long(place_string):
    """Geocoder service to receive lat long for places."""
    g = geocoder.google(place_string + " " + LOCAL_TOWN)
    return g.latlng if g.status == 'OK' else None


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
