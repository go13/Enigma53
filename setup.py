from setuptools import setup

setup(name='mNemoCity',
      version='1.0',
      description='mNemoCity',
      author='Dmitro',
      author_email='example@example.com',
      url='http://www.python.org/sigs/distutils-sig/',
      install_requires=['flask', 'Flask-FlatPages', 'sqlalchemy', \
                        'mysql-python', 'flask-sqlalchemy', 'flask-login', 'requests', 'Flask-WTF', 'scrubber'],
     )