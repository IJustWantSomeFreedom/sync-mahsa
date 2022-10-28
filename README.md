# Sync Mahsa


## What is this repo?
This project has been started to let people sing iranian freedom songs together synchronously. this website is an offline PWA. and syncs with date and time

## Table of contents

- [Sync Mahsa](#sync-mahsa)
  - [What is this repo?](#what-is-this-repo)
  - [Table of contents](#table-of-contents)
  - [Usage](#usage)
  - [Supported songs and lyrics languages](#supported-songs-and-lyrics-languages)
  - [Contributing](#contributing)
    - [How to contribute](#how-to-contribute)
      - [For Non-developers:](#for-non-developers)
      - [For developers:](#for-developers)
      - [What about lyrics](#what-about-lyrics)
        - [format of info.json](#format-of-infojson)
        - [format of [locale].lyrics.json](#format-of-localelyricsjson)
    - [Git-side Steps](#git-side-steps)
  - [Built With](#built-with)

## Usage
1. (optional, recommended for better experience) install a chromium-based browser. like Brave (recommended), chrome or Microsoft Edge
2. open the website.
3. wait until a successful message shows up at the right bottom corner.
4. Now you can use this website offline. just open it without any internet at any time.
5. (optional) you can also install the website as pwa on your device from your browser (there must be an install button). if you cannot find the install button you can google `how to install pwa app in <browser-name>`

## Supported songs and lyrics languages
feel free to contribute and add more lyrics in your language

- Baraye (For) - Shervin
  - Farsi
  - Finglish
- Soroode zan (Woman's Anthem) - Mehdi Yarrahi
  - Farsi
  - Finglish
- Yare Dabestanie man (My Grade-School Friend) - Fereydoon Foroughi
  - Farsi
  - Finglish

## Contributing

Any pull requests are pleasured to Iran and your families.

### How to contribute

#### For Non-developers:
- share
- use
- make issue of bugs or idea requests
- translate lyrics

note:
> adding new song is not easy. songs are date/time dependent. so adding a new one will change the timeline and lose the synchronization. because this is an offline pwa. not everyone will update it everyday.

#### For developers:
- like always:
  - open issue
  - fix bugs
  - open PR
  - improve documentation
  - or just do like [non-developers](#for-non-developers)

#### What about lyrics

there is a folder per song in `/songs` (e.g. `/songs/baraye-shervin`).
in each folder you can find files like this:
```
- songs
  |- [song-name]
     |- music.mp3 (this is the music)
     |- Farsi.lyrics.json (lyrics in Farsi)
     |- Finglish.lyrics.json (lyrics in Finglish)
     |- info.json (info about song)
```

##### format of info.json
```ts
{
    "name": string - Name Of Song
    "singer": string - Name Of Singer
    "duration": number - Duration of song in millisecond
}
```

##### format of [locale].lyrics.json
```ts
{
    "delay": number in millisecond - use this to sync the lyrics with song by adding delay (can be negative)
    "lyrics": {
        "minute:second:millisecond": string - lyric
        //example
        "0:10:000": "For my sister, your sister, our sisters"
    }
}
```

### Git-side Steps

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
    1.  if you are adding lyrics translation, add its locale name [here](#supported-songs-and-lyrics-languages)
3.  Add your changes: `git add .`
4.  Commit your changes: `git commit -am 'Add some feature'`
5.  Push to the branch: `git push origin my-new-feature`
6.  Submit a pull request

Don't forget anonymity :)

## Built With
Built with hopes and love for our angles, Mahsas and Nikas
