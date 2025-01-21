import express from 'express';
import { exec } from 'child_process';

const app = express();

app.get('/json', (req, res) => {
  const youtubeUrl = req.query.url as string;

  if (!youtubeUrl) {
    return res.status(400).json({
      status: "error",
      message: "No URL provided. Use '?url=YOUTUBE_URL' in the query."
    });
  }

  try {
    const command = `yt-dlp -f bestaudio/best --get-url ${youtubeUrl}`;

    exec(command, (error, stdout, stderr) => {
      if (error || stderr) {
        return res.status(500).json({
          status: "error",
          message: error ? error.message : stderr
        });
      }

      const playbackUrl = stdout.trim();
      if (playbackUrl) {
        res.json({
          status: "success",
          title: youtubeUrl,  // You can add code to extract title if needed
          playback_url: playbackUrl
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Could not retrieve playback URL"
        });
      }
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: e.message
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
