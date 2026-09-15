"""Download optional public-domain demo imagery into data/sample_images.
Run from backend: python download_sample_images.py
Sources are Wikimedia Commons pages listed in sample_images_sources.txt.
"""
from pathlib import Path
import urllib.request

OUT=Path('data/sample_images'); OUT.mkdir(parents=True,exist_ok=True)
FILES={
'coral_reef_public_domain.jpg':'https://upload.wikimedia.org/wikipedia/commons/0/02/Underwater_photo_of_coral_reef.jpg',
'marine_debris_public_domain.jpg':'https://upload.wikimedia.org/wikipedia/commons/b/b3/Marine_debris_on_Hawaiian_coast.jpg',
'coastal_cleanup_public_domain.jpg':'https://upload.wikimedia.org/wikipedia/commons/2/20/Second_Beach_for_International_Coastal_Cleanup_%2837209289731%29.jpg',
}
for name,url in FILES.items():
    target=OUT/name
    if target.exists(): print('Exists:',target); continue
    print('Downloading',name)
    urllib.request.urlretrieve(url,target)
print('Done.')
