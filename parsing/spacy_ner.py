"""Named entity recognition using spacy."""
import spacy.en
import argparse

def ner(input_string):
    """Basic ner."""
    unicode_string = unicode(input_string, "utf-8")
    parser = spacy.en.English()
    parsed_sentence = parser(unicode_string)
    for entity in parsed_sentence.ents:
        print entity.label, entity.label_, ' '.join(t.orth_ for t in entity)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Test string')
    parser.add_argument("text", help="Named entity recognition of text", nargs="*")
    args = parser.parse_args()
    ner(args.text[0])
    print "Something happened"

