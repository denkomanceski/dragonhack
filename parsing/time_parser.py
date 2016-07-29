"""Module to parse time data."""
from timex import tag, gmt, ground
from dateutil import parser


def timex_tag(content, base_time=gmt()):
    """Timex tagger using the timex module.

    Ripped from nltk_contrib using regex.
    """
    tagged_text = tag(content)
    injected_base_text = ground(tagged_text, base_time)
    return injected_base_text


def example_timex_tag():
    """Example for testing timex."""
    return timex_tag('Belfast up and coming band Cashier No.9 are playing a'
                     'free gig in the Mercantile this Saturday night'
                     ' at 9.30pm.')


def example2_timex_tag():
    """Removing TIMEX2 tags from example for dateutil."""
    content = example_timex_tag().replace("TIMEX2", "")
    return content


def parse_time(dated_content):
    """Dateutil parser which merges the timex date with time data.

    Doesn't work if there are any additional numbers in string
    """
    timed_content = parser.parse(dated_content)
    print timed_content
    return timed_content
