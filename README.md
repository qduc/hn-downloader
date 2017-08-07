# Hacker News downloader

Simple CLI app to download [Hacker News](https://news.ycombinator.com/) database using API from <https://github.com/HackerNews/API>

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js

- A MySQL server

### Configuration

Install the dependencies

```
npm install
```

Prepare database schema: Import `database.sql` file that came with this repo  
_( Note: you must create an empty database first then `USE` it )_

Change `database.js` according to your database credential

Update `config.js` to suit your preference _(optional)_

```
    concurrentFetch : 1000
    maxRetry        : 3
```
- `concurrentFetch` number of items to download before insert into database
- `maxretry` if a network error occured, how many times it will attempt to retry before giving up

You are all set!

### Usage

![image](https://user-images.githubusercontent.com/11575015/29034687-4e892120-7bc3-11e7-9b05-4b76e7922678.png)

```
node index.js [largestId]
```

- `largestId` _(optional)_ largest ID the script will download then stop, in case you just want to download a part of it.  
Leave it blank to download the whole database (takes several hours!)

**Warning:** [Aug/2017] Whole database is nearly 7GB. Make sure you have enough room for it.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
