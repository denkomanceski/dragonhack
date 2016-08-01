import unittest
import datetime
from time_parser import timex_parse, parse_time
 
class TestUM(unittest.TestCase):
 
    def setUp(self):
        pass

    def test_parse_tomorrow(self):
        d1 = parse_time('We are going to meet tomorrow at 9:30pm')
        d2 = datetime.datetime.combine((datetime.date.today() + datetime.timedelta(days=1)), datetime.time(21,30))
        self.assertEqual(d1, d2)

    def test_parse_today(self):
        d1 = datetime.datetime.combine(datetime.date.today(), datetime.time(21,30))
        d2 = parse_time('We are going to meet today at 9:30pm')
        self.assertEqual(d1, d2)

    def test_verbose_today_tomorrow(self):
        e1 = 'We are going to meet tomorrow at 9:30pm'
        e2 = 'We are going to meet today at 9:30pm'
        d1 = parse_time(e1)
        d2 = parse_time(e2) +  datetime.timedelta(days=1)
        self.assertEqual(d1, d2)


 
if __name__ == '__main__':
    unittest.main()
