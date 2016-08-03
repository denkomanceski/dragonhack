"""Module to parse time data."""
from timex import tag, gmt, ground
from dateutil import parser
import sys, datetime


def timex_parse(content, base_time=gmt()):
    """Timex tagger using the timex module.

    Ripped from nltk_contrib using regex.
    """
    tagged_text = tag(content)
    injected_base_text = ground(tagged_text, base_time)
    return injected_base_text


def dateutil_parse(content):
    """Dateutil parser which merges the timex date with time data.

    Doesn't work if there are any additional numbers in string
    """
    timed_content = parser.parse(content, fuzzy=True)
    return timed_content


def parse_time(content):
    """Time parser combining dateutil and timex"""
    if isinstance(content, str):
        content = unicode(content, "utf-8")
    timex_parsed = timex_parse(content)
    dateutil_parsed = dateutil_parse(timex_parsed)
    return dateutil_parsed


def example_timex_tag():
    """Example for testing timex."""
    return timex_parsed(
            'Belfast up and coming band Cashier are playing a free gig in the Mercantile tomorrow at 9:30pm.')


def example_dateutil():
    """Example for testing dateutil."""
    content = timex_parsed(
            'Belfast up and coming band Cashier are playing a free gig in the Mercantile tomorrow at 9:30pm.')
    return dateutil_parsed(content)


if __name__ == "__main__":
    x = ""
    for part in sys.argv[1:].split(">")[4:]:
        x = x + part
    print parse_time(x)
