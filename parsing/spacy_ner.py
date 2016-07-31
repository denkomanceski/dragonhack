"""Named entity recognition using spacy."""
import spacy.en


def ner(input_string):
    """Basic ner."""
    unicode_string = unicode(input_string, "utf-8")
    parser = spacy.en.English()
    parsed_sentence = parser(unicode_string)
    for entity in parsed_sentence.ents:
        print entity.label, entity.label_, ' '.join(t.orth_ for t in entity)
