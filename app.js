const express = require('express');
const ytDlp = require('yt-dlp');

const app = express();
const port = process.env.PORT || 3000;

// API route to get the playback URL
app.get('/play', async (req, res) => {
  const youtubeUrl = req.query.url;

  if (!youtubeUrl) {
    return res.status(400).json({
      status: 'error',
      message: 'No URL provided. Use "?url=YOUTUBE_URL" in the query.',
    });
  }

  try {
    // yt-dlp options for extracting URL without downloading
    const options = ['-e', '--no-warnings', '--quiet', '--extract-audio', '--audio-quality', '0', youtubeUrl];

    // Execute the yt-dlp command
    ytDlp.exec(options).then(info => {
      const playbackUrl = info.url;

      // Return the response as JSON
      res.json({
        status: 'success',
        title: info.title,
        playback_url: playbackUrl
      });
    }).catch(err => {
      // If error occurs
      res.status(500).json({
        status: 'error',
        message: 'Could not retrieve playback URL',
        error: err.message
      });
    });
  } catch (err) {
    // General error handling
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
