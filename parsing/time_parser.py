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
    timex_parsed = timex_parse(content)
    dateutil_parsed = dateutil_parse(timex_parsed)
    return dateutil_parsed


def example_timex_tag():
    """Example for testing timex."""
    return timex_tag('Belfast up and coming band Cashier are playing a free gig in the Mercantile tomorrow at 9:30pm.')


def example_dateutil():
    """Example for testing dateutil."""
    content = timex_tag('Belfast up and coming band Cashier are playing a free gig in the Mercantile tomorrow at 9:30pm.')
    return parse_time(content)


def should_parse_tomorrow():
    print "tomorrow"
    print str(datetime.date.today() + datetime.timedelta(days=1))
    print str(parse_time('We are going to meet tomorrow at 9:30pm'));

def should_parse_today():
    print "today"
    print str(datetime.date.today())
    print str(parse_time('We are going to meet today at 9:30pm'));

if __name__ == "__main__":
    if(len(sys.argv) >= 2 and sys.argv[1]=='debug'):
        should_parse_today()
        should_parse_tomorrow()
    else:
        for v in sys.argv[1:]:
            print(parse_time(v))
