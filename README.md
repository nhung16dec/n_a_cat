# N a cat

A simple client-side web app for creating and sharing cat greeting cards. The app encodes card data in the URL hash, making cards shareable without a backend.

## Features

- Choose from a variety of cute cat images
- Add a personalized greeting message
- Share cards via URL (no backend required)

## How to Run

This is a static site—just open `index.html` in a browser. No build step required.

## Tech Stack

- Vanilla JavaScript (no framework)
- CSS with custom properties
- DM Serif Display + Nunito fonts

## Project Structure

- `index.html` - Main HTML with two page sections (`#page-compose` for the form, `#page-card` for the result)
- `style.css` - Styling using CSS variables
- `app.js` - Application logic including hash-based routing, form handling, and card rendering
- `cats.js` - Array of cat objects with id, name, and image URLs
