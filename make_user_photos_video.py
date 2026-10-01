import asyncio
import os
import subprocess
import edge_tts
from PIL import Image, ImageDraw, ImageFont

# Video using EXCLUSIVELY the Cover Page and the 3 Photos provided by the user
scenes = [
    {
        "id": "cover_intro",
        "image": "cover.png",
        "title": "THE LIVING MUSEUM — SANITY CHALLENGE 2026",
        "subtitle": "Walk Through a 3D Gallery Where Every Exhibit is Live Sanity Content",
        "text": "Welcome to The Living Museum, built for the DEV Sanity Challenge. Step inside an interactive three-dimensional gallery where every single exhibit is live, structured content powered by Sanity."
    },
    {
        "id": "user_scene1",
        "image": "user_shot_01_modal.png",
        "title": "ROOM 1 (INVENTIONS) & 4-ARROW D-PAD",
        "subtitle": "4-Directional Arrow Controls & Smooth Continuous Walk",
        "text": "Step inside Room 1, Inventions. At the bottom right, four directional arrow buttons give you full continuous walking control to move forward, backward, left, and right across the three-dimensional space."
    },
    {
        "id": "user_scene2",
        "image": "user_shot_01_modal.png",
        "title": "CLICK TO INSPECT EXHIBIT",
        "subtitle": "Steam Engine • James Watt (1776 AD) • Sanity Lifecycle: ACTIVE",
        "text": "Clicking directly on any exhibit, like the Steam Engine, opens a live inspection modal displaying the authentic visual artifact, creator James Watt, the era of 1776, a historical summary, and its live Sanity lifecycle status and vitality bar."
    },
    {
        "id": "user_scene3",
        "image": "user_shot_02_walk_rooms.png",
        "title": "ROOM 2 (ART) & 4 THEMATIC ROOMS",
        "subtitle": "Room 1 Inventions • Room 2 Art • Room 3 History • Room 4 Future",
        "text": "Navigate smoothly across four dedicated thematic halls: Inventions, Art, History, and Future technologies as you glide past marble pedestals and classical archways down the grand hall."
    },
    {
        "id": "user_scene4",
        "image": "user_shot_03_night_mode.png",
        "title": "NIGHT MODE / DARK MODE",
        "subtitle": "Dynamic Nocturnal Atmosphere with Spotlight Illumination",
        "text": "With a single tap on the theme button in the top right, Night Mode transforms the sunlit gallery into a dramatic dark mode atmosphere illuminated by focal lanterns. Experience the living museum live now on Vercel."
    }
]

VOICE = "en-US-ChristopherNeural"

def prepare_styled_frames():
    print("Preparing 1080p frames from user uploaded images...")
    for idx, scene in enumerate(scenes):
        base_img = Image.open(scene["image"]).convert("RGBA")
        base_img = base_img.resize((1920, 1080), Image.Resampling.LANCZOS)
        
        overlay = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        
        # Bottom dark glass bar with neon line
        draw.rectangle([(0, 1080 - 130), (1920, 1080)], fill=(10, 15, 25, 230))
        draw.line([(0, 1080 - 130), (1920, 1080 - 130)], fill=(56, 189, 248, 255), width=3)
        
        font_path = "C:/Windows/Fonts/arial.ttf"
        font_path_bold = "C:/Windows/Fonts/arialbd.ttf"
        
        try:
            title_font = ImageFont.truetype(font_path_bold, 36)
            subtitle_font = ImageFont.truetype(font_path, 24)
        except Exception:
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()
            
        draw.text((60, 1080 - 110), scene["title"], fill=(255, 255, 255, 255), font=title_font)
        draw.text((60, 1080 - 55), scene["subtitle"], fill=(56, 189, 248, 255), font=subtitle_font)
        
        final_frame = Image.alpha_composite(base_img, overlay).convert("RGB")
        frame_name = f"user_frame_{scene['id']}.jpg"
        final_frame.save(frame_name, quality=95)
        scene["frame"] = frame_name
        print(f"Generated {frame_name}")

async def generate_audio():
    print("Generating voiceover audio for user scenes...")
    for idx, scene in enumerate(scenes):
        audio_file = f"audio_{scene['id']}.mp3"
        print(f"Generating {audio_file}...")
        communicate = edge_tts.Communicate(scene["text"], VOICE, rate="+3%")
        await communicate.save(audio_file)
        
        cmd = [
            "ffprobe", "-v", "error", "-show_entries",
            "format=duration", "-of", "default=noprint_wrappers=1:nokey=1",
            audio_file
        ]
        duration = float(subprocess.check_output(cmd).decode().strip())
        scene["duration"] = duration + 0.35
        print(f"Scene {idx+1} duration: {scene['duration']:.2f}s")

def build_video_clips():
    print("Building video clips using user photos and cover...")
    concat_list = []
    
    for idx, scene in enumerate(scenes):
        video_clip = f"clip_{scene['id']}.mp4"
        audio_file = f"audio_{scene['id']}.mp3"
        duration = scene["duration"]
        frame = scene["frame"]
        
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", frame,
            "-i", audio_file,
            "-c:v", "libx264", "-tune", "stillimage", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k",
            "-t", f"{duration:.3f}",
            "-shortest",
            video_clip
        ]
        
        print(f"Rendering {video_clip}...")
        subprocess.run(cmd, check=True)
        concat_list.append(video_clip)
        
    with open("user_clips.txt", "w") as f:
        for clip in concat_list:
            f.write(f"file '{clip}'\n")
            
    output_video = "Museum_of_Code_Demo.mp4"
    print(f"Concatenating into {output_video}...")
    concat_cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", "user_clips.txt",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-movflags", "+faststart",
        output_video
    ]
    subprocess.run(concat_cmd, check=True)
    
    # Also overwrite Museum_Interactive_Tour.mp4
    subprocess.run(["ffmpeg", "-y", "-i", output_video, "-c", "copy", "Museum_Interactive_Tour.mp4"], check=True)
    print("SUCCESS: Demo videos successfully rendered with cover page and user photos!")

if __name__ == "__main__":
    prepare_styled_frames()
    asyncio.run(generate_audio())
    build_video_clips()
