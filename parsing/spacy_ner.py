"""Named entity recognition using spacy."""
import spacy.en
import argparse
import numpy as np

nlu = spacy.en.English()
vectors = np.asarray(map(lambda x: x.vector, nlu.vocab))
vocab = map(lambda x: x.orth_, nlu.vocab)

def utf8(s):
    if isinstance(s, str):
        s = unicode(s, "utf-8")
    return s

def most_similar(word, topn=5):
    word = utf8(word)
    dists = np.dot(vectors, nlu.vocab[word].vector)
    return map(lambda x: (vocab[x], dists[x]), np.argsort(dists)[::-1][:topn])

def most_similar_in_sentence(tokens, word, pos_tags=[], topn=5, confidence=0):
    word = utf8(word)
    if pos_tags:
        vocab = filter(lambda x: x.pos_ in pos_tags, tokens)
    else:
        vocab = tokens
    dists = np.dot(np.asarray(map(lambda x: x.vector, vocab)), nlu.vocab[word].vector)
    potentials = map(lambda x: (vocab[x].orth_, dists[x]), np.argsort(dists)[::-1][:topn])
    return filter(lambda x: x[1] >= confidence, potentials)


def similar_in_sentence(word, sentence, pos_tags=[], topn=5, confidence=0):
    sentence = utf8(sentence)
    word = utf8(word)
    tokens = nlu(sentence)
    return most_similar_in_sentence(tokens=tokens, word=word, pos_tags=pos_tags, topn=topn, confidence=confidence)
    

def ner(input_string):
    """Basic ner."""
    input_string = utf8(input_string)
    parsed_sentence = nlu(input_string)
    for entity in parsed_sentence.ents:
        # print only cities and countries (label_ == GPE or label == 350
        if entity.label == 350:
            print ' '.join(t.orth_ for t in entity)


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
