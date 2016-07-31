# Installation
### virtualenv
Virtualenv is a package to encapsulate python installations. I recommend installing virtualenv initially and initialising a python 2.* environment. I am using Python 2.7.6.
`virtualenv -p #yourpython venv `

Activate the virtualenv:
`source venv/bin/activate`

Install requirements:
`pip install -r requirements.txt`

Install nltk modules within an interactive Python shell by calling: `nltk.download("book")`

Download spacy English grammar (500MB):
`python -m spacy.en.download`
