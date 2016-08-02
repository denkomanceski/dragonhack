"""Named entity recognition using spacy."""
import spacy.en
import argparse

spacy_parser = spacy.en.English()

def ner(input_string):
    """Basic ner."""
    unicode_string = unicode(input_string, "utf-8")
    parsed_sentence = spacy_parser(unicode_string)
    for entity in parsed_sentence.ents:
        print entity.label, entity.label_, ' '.join(t.orth_ for t in entity)

def test_examples():
    with open("example.txt") as f:
        content = f.readlines()
        for sentence in content:
            print sentence
            ner(sentence)
            print "---"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Test string')
    parser.add_argument("text", help="Named entity recognition of text", nargs="*")
    args = parser.parse_args()
    if args.text[0] == "example":
        print "Testing examples:"
        test_examples()
    else:
        ner(args.text[0])
        print "Something happened"

