import streamlit as st
from yt_dlp import YoutubeDL
import os
import urllib.parse

st.set_page_config(page_title="YouTube Downloader API")

query_params = st.experimental_get_query_params()
youtube_url = query_params.get("url", [None])[0]

if youtube_url:
    try:
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': './downloads/%(title)s.%(ext)s',
            'noplaylist': True,
        }
        with YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(youtube_url, download=True)
            video_title = info_dict.get('title', 'Unknown Title')
            file_path = ydl.prepare_filename(info_dict)

        st.success("Download successful!")
        st.write(f"**Title:** {video_title}")
        st.write(f"**Saved to:** {file_path}")

        file_url = f"/downloads/{urllib.parse.quote(os.path.basename(file_path))}"
        st.write(f"Access your file here: {file_url}")

        with open(file_path, "rb") as f:
            st.download_button(
                label="Download File",
                data=f,
                file_name=os.path.basename(file_path),
                mime="audio/mpeg"
            )

    except Exception as e:
        st.error(f"Error: {e}")
else:
    st.warning("Add '?url=YOUR_YOUTUBE_URL' to the URL to use the API.")
