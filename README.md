
# MyGes Calendar Scrapper

This project scrap [my scool website](https://myges.fr) for retriving the calendar. Then it send a ICS file containing all the course of the week and a screenshot of the calendar to a discord webhook.

It's a simple personal project to learn how to use [Puppeteer](https://github.com/puppeteer/puppeteer), but mostly to compensate the solwness of the website.

The project is designed to be run on a arm64 system, but it should work on any system.

The project is actualy hosted on my [Raspberry Pi 4](https://www.raspberrypi.org/products/raspberry-pi-4-model-b/), and run every monday at 6:00 AM via a cron job.

## Run Locally

Clone the project

```bash
git clone git@github.com:mrpinkcat/myges-calendar-scraper.git
```

Go to the project directory

```bash
cd myges-calendar-scraper
```

Install dependencies

```bash
npm install
sudo apt install chromium
```

Start the project

```bash
npm run start
```

You can also run it periodically with a cron job.

## Environment Variables

First copy the `.env.example` file to `.env` and fill it with your values.

```bash
cp .env.example .env
```

To run this project, you will need to add the following environment variables to your .env file

| Name | Description | Example |
| --- | --- | --- |
| `USERNAME` | The username of your myges account | `jdoe` |
| `PASSWORD` | The password of your myges account | `password` |
| `WEBHOOK_URL` | The url of the discord webhook | `https://discord.com/api/webhooks/id/token` |
| `PUSHOVER_TOKEN` | The token of your pushover account | `string` |
| `PUSHOVER_USER` | The user of your pushover account | `string` |
