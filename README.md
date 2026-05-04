# Search Engine

A book search app built on Node.js, Express, and TypeScript. It pulls results from the [Open Library API](https://openlibrary.org/developers/api) and saves search history per user to a local SQLite database.

The original boilerplate README is preserved at [README-old.md](README-old.md).

---

## Prerequisites

**Node.js 18 or higher is required.**

This project uses the native `fetch` API and `AbortController`, both of which are built into Node starting at version 18. There is no polyfill — running on an older version will crash at startup with no clear error message. Node 18 is the current maintenance LTS release and the minimum you should be running in any environment today.

You can check your version with:

```bash
node -v
```

If you need to upgrade, [nodejs.org](https://nodejs.org) has installers for every platform, or use a version manager like [nvm](https://github.com/nvm-sh/nvm) (Mac/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows).

---

## Running it

**Mac / Linux**

```bash
bash setup.sh
```

The script will check your dependencies, ask if you want to copy `.env.example` to `.env`, install packages, run the unit tests, then ask if you want to start the server.

**Windows**

```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-windows.ps1
```

Same flow as above. Note: `setup.sh` detects Windows and will print this command for you if you run it by mistake.

Once running, the app is available at:

| URL | What it is |
| --- | --- |
| http://localhost:3000 | The search UI |
| http://localhost:3000/api | API info |

To start the server on its own without running setup again:

```bash
npm start serve
```

---

## Personal Notes

This is forked from the boilerplate repo here: https://github.com/w3tecch/express-typescript-boilerplate

Great place to start! I gutted a lot of it, but might have left some bits and bobs around.

I had a ton of fun writing this! Hopefully everything is in order, but if you have any trouble running it, you know where to reach me.

I tried to challenge myself by timeboxing this to 4 hours, I ran over a little bit, but this is what I was able to get.

**Heres some screencaps:**

<img width="1017" height="424" alt="api" src="https://github.com/user-attachments/assets/daf3c009-5847-4450-ba59-92c1367ace36" />
---
<img width="1409" height="1261" alt="bryanSearch" src="https://github.com/user-attachments/assets/1d117996-5e03-41eb-8242-92043d7ec0a4" />
---
<img width="1242" height="1271" alt="searchHistory" src="https://github.com/user-attachments/assets/8096b879-3e63-44be-84e1-f996173131e6" />



### TODO: ###
1. Add comments to source files
2. Cleanup dependency warnings
3. Dockerize?
