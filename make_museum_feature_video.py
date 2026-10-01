import asyncio
import os
import subprocess
import edge_tts
from PIL import Image, ImageDraw, ImageFont

scenes = [
    {
        "id": "feat1",
        "image": "museum_scene_01_room1.png",
        "title": "ROOM 1 (INVENTIONS) & 4-ARROW D-PAD",
        "subtitle": "Smooth Directional Navigation & Walking Controls",
        "text": "Welcome inside the Museum of Code. Here in Room 1, Inventions, you can explore foundational human and computing breakthroughs. At the bottom right, you have four directional arrow controls: forward, backward, left, and right, allowing continuous walking through the three-dimensional space."
    },
    {
        "id": "feat2",
        "image": "museum_scene_02_walk_moving.png",
        "title": "SMOOTH 3D WALKING & MOVEMENT",
        "subtitle": "First-Person Camera Movement with 60FPS Fluidity",
        "text": "As you press the forward arrow or W-A-S-D keys, the camera smoothly traverses the grand hall, giving you an immersive first-person walk past curated pedestals and live exhibits."
    },
    {
        "id": "feat3",
        "image": "museum_scene_03_room2_art.png",
        "title": "THE 4 THEMATIC ROOMS",
        "subtitle": "Room 1 Inventions  •  Room 2 Art  •  Room 3 History  •  Room 4 Future",
        "text": "Using the quick navigation bar at the bottom, you can instantly teleport across four distinct rooms: Room 1 for Inventions, Room 2 for Art, Room 3 for History, and Room 4 for Future frontier technologies."
    },
    {
        "id": "feat4",
        "image": "museum_scene_05_modal_open.png",
        "title": "CLICK TO INSPECT EXHIBIT",
        "subtitle": "Interactive Details Modal with Sanity Lifecycle & Vitality",
        "text": "Clicking directly on any exhibit frame opens a detailed inspection modal. Here you can view the artifact's historical creator, time period, in-depth description, live Sanity lifecycle state, and real-time vitality index."
    },
    {
        "id": "feat5",
        "image": "museum_scene_06_dark_mode.png",
        "title": "ATMOSPHERIC DARK MODE",
        "subtitle": "Dynamic Day/Night Lighting Shift with Lantern Illumination",
        "text": "At the top right, a single tap on the theme toggle engages Dark Mode, shifting the sunlit skylight into an atmospheric nocturnal gallery with dedicated focal lanterns. Experience the living museum live on Vercel."
    }
]

VOICE = "en-US-ChristopherNeural"

def prepare_styled_frames():
    print("Preparing styled 1080p frames...")
    for idx, scene in enumerate(scenes):
        base_img = Image.open(scene["image"]).convert("RGBA")
        base_img = base_img.resize((1920, 1080), Image.Resampling.LANCZOS)
        
        overlay = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        
        draw.rectangle([(0, 1080 - 130), (1920, 1080)], fill=(10, 15, 25, 225))
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
        frame_name = f"frame_{scene['id']}.jpg"
        final_frame.save(frame_name, quality=95)
        scene["frame"] = frame_name
        print(f"Generated {frame_name}")

async def generate_audio():
    print("Generating voiceover audio...")
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
    print("Building video clips...")
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
        
    with open("museum_clips.txt", "w") as f:
        for clip in concat_list:
            f.write(f"file '{clip}'\n")
            
    output_video = "Museum_Interactive_Tour.mp4"
    print(f"Concatenating into {output_video}...")
    concat_cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", "museum_clips.txt",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-movflags", "+faststart",
        output_video
    ]
    subprocess.run(concat_cmd, check=True)
    print("SUCCESS: Museum_Interactive_Tour.mp4 created successfully!")

if __name__ == "__main__":
    prepare_styled_frames()
    asyncio.run(generate_audio())
    build_video_clips()
