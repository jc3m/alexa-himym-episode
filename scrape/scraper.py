import requests
from bs4 import BeautifulSoup
import json

def processRow(tableRow):
  if tableRow.find('td') is None:
    return None

  data = tableRow.find_all('td')
  ep_info = {}

  se, ep = map(int, data[0].string.split('.'))
  ep_info['season'] = se
  ep_info['episode'] = ep
  ep_info['title'] = data[1].a.string
  ep_info['rating'] = float(data[2].string)
  return ep_info

def scrape(fileObj):
  url = 'http://www.imdb.com/title/tt0460649/epdate'
  r = requests.get(url)

  soup = BeautifulSoup(r.text, 'html.parser')
  table = soup.find("div", { "id": "tn15content" }).table

  episodes = []
  rows = map(processRow, table.find_all("tr"))
  for row in rows:
    if row is not None:
      episodes.append(row)

  json.dump(episodes, fileObj)

def main():
  f = open('../src/episodes.json', 'w')
  scrape(f)
  f.close()

if __name__ == '__main__':
  main()
