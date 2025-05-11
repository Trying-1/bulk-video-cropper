"""
Bulk Video Cropper

A professional application to crop multiple videos using FFmpeg with individual crop settings for each video.

Features:
1. Load multiple videos from a folder and preview them
2. Set and save individual crop areas for each video
3. Visual indicators in the file list showing which videos have crop settings defined
4. Export all videos with their individual crop settings in one click
5. Modern UI with professional styling and responsive layout
6. Real-time progress tracking during export operations
7. Aspect ratio display for better composition
8. Efficient video processing using FFmpeg for high-quality results

Requirements:
- Python 3.6+
- FFmpeg installed and available in PATH
- Required Python packages: tkinter, opencv-python (cv2), Pillow (PIL)

Usage:
1. Select input folder containing videos
2. Set output folder for cropped videos
3. Click on videos in the list to preview and set crop areas
4. Use "Crop Current Video" to process individual videos or "Export Cropped Videos" to process all at once

Author: Cascade
Version: 1.0
"""

import os
import sys
import tkinter as tk
from tkinter import filedialog, messagebox
from tkinter import ttk
import subprocess
import threading
import cv2
from PIL import Image, ImageTk
import platform

class BulkVideoCropper:
    def __init__(self, root):
        self.root = root
        self.root.title("Bulk Video Cropper")
        self.root.geometry("1200x700")
        
        # Initialize variables
        self.video_folder = ""
        self.output_folder = ""
        self.video_files = []
        self.current_video = None
        self.current_index = 0
        self.cap = None
        self.frame = None
        
        # Crop variables
        self.crop_x = 0
        self.crop_y = 0
        self.crop_width = 0
        self.crop_height = 0
        self.start_x = 0
        self.start_y = 0
        self.scale_x = 1.0
        self.scale_y = 1.0
        
        # Resize mode variables
        self.resize_mode = None  # None, 'move', 'top', 'bottom', 'left', 'right', 'topleft', 'topright', 'bottomleft', 'bottomright'
        self.resize_start_x = 0
        self.resize_start_y = 0
        self.resize_start_crop_x = 0
        self.resize_start_crop_y = 0
        self.resize_start_width = 0
        self.resize_start_height = 0
        
        # Store crop settings for each video
        self.video_crop_settings = {}
        
        # Create UI
        self.create_ui()
        
        # Track which videos have been cropped
        self.cropped_videos = []
        
    def set_theme(self):
        """Set up the modern theme and styling"""
        # Configure ttk style
        self.style = ttk.Style()
        
        # Set theme based on platform
        if platform.system() == "Windows":
            self.style.theme_use('vista')
        elif platform.system() == "Darwin":  # macOS
            self.style.theme_use('aqua')
        else:  # Linux and others
            self.style.theme_use('clam')
        
        # Configure colors
        bg_color = "#f5f5f5"  # Light gray background
        accent_color = "#3498db"  # Blue accent
        text_color = "#2c3e50"  # Dark blue-gray text
        highlight_color = "#d6eaf8"  # Light blue for highlighted items
        
        # Configure ttk styles
        self.style.configure('TFrame', background=bg_color)
        self.style.configure('TLabel', background=bg_color, foreground=text_color, font=('Segoe UI', 10))
        self.style.configure('TButton', font=('Segoe UI', 10))
        self.style.configure('Accent.TButton', background=accent_color)
        self.style.configure('TEntry', font=('Segoe UI', 10))
        
        # Style for the legend color box
        self.style.configure('Legend.TFrame', background=highlight_color)
        
        # Set window background
        self.root.configure(bg=bg_color)
    
    def create_ui(self):
        """Create the user interface"""
        # Set up the theme
        self.set_theme()
        
        # Configure the root grid layout
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        
        # Main container
        main_container = ttk.Frame(self.root, padding=10)
        main_container.grid(row=0, column=0, sticky=(tk.N, tk.S, tk.E, tk.W))
        
        # Configure main container grid - left panel takes 1 part, right panel takes 3 parts
        main_container.columnconfigure(0, weight=1)
        main_container.columnconfigure(1, weight=3)
        main_container.rowconfigure(0, weight=1)
        
        # === LEFT PANEL (Controls) ===
        left_panel = ttk.Frame(main_container)
        left_panel.grid(row=0, column=0, sticky=(tk.N, tk.S, tk.W, tk.E), padx=(0, 10))
        left_panel.columnconfigure(0, weight=1)
        
        # Folder selection frame
        folder_frame = ttk.LabelFrame(left_panel, text="Folders", padding=10)
        folder_frame.grid(row=0, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        folder_frame.columnconfigure(1, weight=1)
        
        # Input folder
        ttk.Label(folder_frame, text="Input:").grid(row=0, column=0, sticky=tk.W, padx=(0, 5))
        self.folder_entry = ttk.Entry(folder_frame)
        self.folder_entry.grid(row=0, column=1, sticky=(tk.W, tk.E), padx=(0, 5))
        ttk.Button(folder_frame, text="Browse", command=self.select_input_folder).grid(row=0, column=2)
        
        # Output folder
        ttk.Label(folder_frame, text="Output:").grid(row=1, column=0, sticky=tk.W, padx=(0, 5), pady=(5, 0))
        self.output_entry = ttk.Entry(folder_frame)
        self.output_entry.grid(row=1, column=1, sticky=(tk.W, tk.E), padx=(0, 5), pady=(5, 0))
        ttk.Button(folder_frame, text="Browse", command=self.select_output_folder).grid(row=1, column=2, pady=(5, 0))
        
        # Legend for colored items
        legend_frame = ttk.Frame(left_panel)
        legend_frame.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        
        legend_color = ttk.Frame(legend_frame, width=15, height=15)
        legend_color.grid(row=0, column=0, padx=(0, 5))
        legend_color.configure(style="Legend.TFrame")
        
        legend_text = ttk.Label(legend_frame, text="Videos with crop settings")
        legend_text.grid(row=0, column=1, sticky=tk.W)
        
        # File list section
        file_frame = ttk.LabelFrame(left_panel, text="Video Files", padding=10)
        file_frame.grid(row=2, column=0, sticky=(tk.N, tk.S, tk.W, tk.E), pady=(0, 10))
        file_frame.rowconfigure(0, weight=1)
        file_frame.columnconfigure(0, weight=1)
        
        # File listbox with scrollbar
        list_frame = ttk.Frame(file_frame)
        list_frame.grid(row=0, column=0, sticky=(tk.N, tk.S, tk.E, tk.W))
        list_frame.rowconfigure(0, weight=1)
        list_frame.columnconfigure(0, weight=1)
        
        self.file_listbox = tk.Listbox(list_frame, selectmode=tk.SINGLE, 
                                     bg="#2c3e50", fg="white",
                                     font=("Segoe UI", 10), 
                                     bd=0, highlightthickness=0)
        self.file_listbox.grid(row=0, column=0, sticky=(tk.N, tk.S, tk.E, tk.W))
        self.file_listbox.bind("<<ListboxSelect>>", self.on_file_select)
        
        scrollbar = ttk.Scrollbar(list_frame, orient=tk.VERTICAL, command=self.file_listbox.yview)
        scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        self.file_listbox.config(yscrollcommand=scrollbar.set)
        
        # Navigation buttons
        nav_frame = ttk.Frame(file_frame)
        nav_frame.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=(10, 0))
        nav_frame.columnconfigure(0, weight=1)
        nav_frame.columnconfigure(1, weight=1)
        
        ttk.Button(nav_frame, text="« Previous", command=self.prev_video).grid(row=0, column=0, sticky=(tk.W, tk.E), padx=(0, 5))
        ttk.Button(nav_frame, text="Next »", command=self.next_video).grid(row=0, column=1, sticky=(tk.W, tk.E))
        
        # Action buttons
        action_frame = ttk.LabelFrame(left_panel, text="Actions", padding=10)
        action_frame.grid(row=3, column=0, sticky=(tk.W, tk.E), pady=(0, 10))
        action_frame.columnconfigure(0, weight=1)
        
        ttk.Button(action_frame, text="Set Crop", command=self.crop_current, style="Accent.TButton").grid(row=0, column=0, sticky=(tk.W, tk.E), pady=5)
        ttk.Button(action_frame, text="Export Cropped Videos", command=self.export_cropped_videos, style="Accent.TButton").grid(row=1, column=0, sticky=(tk.W, tk.E), pady=5)
        
        # Status bar for left panel
        self.status_var = tk.StringVar(value="Ready")
        status_bar = ttk.Label(left_panel, textvariable=self.status_var, anchor=tk.W, padding=5, relief="sunken")
        status_bar.grid(row=4, column=0, sticky=(tk.W, tk.E))
        
        # === RIGHT PANEL (Video Preview) ===
        right_panel = ttk.LabelFrame(main_container, text="Video Preview", padding=10)
        right_panel.grid(row=0, column=1, sticky=(tk.N, tk.S, tk.E, tk.W))
        right_panel.rowconfigure(0, weight=1)
        right_panel.columnconfigure(0, weight=1)
        
        # Canvas for video display
        self.canvas = tk.Canvas(right_panel, bg="#1e1e1e", highlightthickness=0)
        self.canvas.grid(row=0, column=0, sticky=(tk.N, tk.S, tk.E, tk.W))
        
        # Bind canvas events
        self.canvas.bind("<ButtonPress-1>", self.on_mouse_down)
        self.canvas.bind("<B1-Motion>", self.on_mouse_drag)
        self.canvas.bind("<ButtonRelease-1>", self.on_mouse_up)
        self.canvas.bind("<Motion>", self.on_mouse_move)
        
        # Crop info with better styling
        self.crop_info = tk.StringVar(value="No crop selected")
        crop_info_label = ttk.Label(right_panel, textvariable=self.crop_info, anchor=tk.W, 
                                  background="#2c3e50", foreground="white", padding=5)
        crop_info_label.grid(row=1, column=0, sticky=(tk.W, tk.E), pady=(10, 0))
        
        action_frame = ttk.Frame(right_panel)
        action_frame.grid(row=2, column=0, sticky=(tk.W, tk.E), pady=(10, 0))
        
        ttk.Button(action_frame, text="Reset Crop", command=self.reset_crop).pack(side=tk.LEFT, padx=5)
        ttk.Button(action_frame, text="Crop Current Video", command=self.crop_current).pack(side=tk.LEFT, padx=5)
        ttk.Button(action_frame, text="Crop All Videos", command=self.crop_all).pack(side=tk.LEFT, padx=5)
        ttk.Button(action_frame, text="Export Cropped Videos", style="Accent.TButton", 
                  command=self.export_cropped_videos).pack(side=tk.LEFT, padx=5)
        
        # Status bar with modern styling
        self.status_var = tk.StringVar(value="Ready")
        status_frame = ttk.Frame(main_container, relief="sunken", padding="2 2 2 2")
        status_frame.grid(row=3, column=0, sticky=(tk.W, tk.E), pady=(10, 0))
        
        self.status_bar = ttk.Label(status_frame, textvariable=self.status_var, anchor=tk.W)
        self.status_bar.pack(fill=tk.X)
    
    def select_input_folder(self):
        folder = filedialog.askdirectory(title="Select Video Folder")
        if folder:
            self.video_folder = folder
            self.folder_entry.delete(0, tk.END)
            self.folder_entry.insert(0, folder)
            
            # Set default output folder
            if not self.output_entry.get():
                output = os.path.join(folder, "cropped")
                self.output_folder = output
                self.output_entry.delete(0, tk.END)
                self.output_entry.insert(0, output)
            
            self.load_videos()
    
    def select_output_folder(self):
        folder = filedialog.askdirectory(title="Select Output Folder")
        if folder:
            self.output_folder = folder
            self.output_entry.delete(0, tk.END)
            self.output_entry.insert(0, folder)
    
    def load_videos(self):
        if not self.video_folder:
            return
        
        # Clear listbox
        self.file_listbox.delete(0, tk.END)
        self.video_files = []
        
        # Find video files
        video_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv']
        for file in os.listdir(self.video_folder):
            if any(file.lower().endswith(ext) for ext in video_extensions):
                self.video_files.append(file)
                self.file_listbox.insert(tk.END, file)
                
                # Highlight files that have crop settings
                if file in self.video_crop_settings:
                    self.file_listbox.itemconfig(tk.END, {'bg': '#d6eaf8', 'fg': '#2c3e50'})
        
        if self.video_files:
            self.current_index = 0
            self.load_current_video()
            self.status_var.set(f"Loaded {len(self.video_files)} videos")
        else:
            self.status_var.set("No video files found")
    
    def load_current_video(self):
        if not self.video_files:
            return
        
        # Close previous video
        if self.cap:
            self.cap.release()
        
        # Get current video
        self.current_video = os.path.join(self.video_folder, self.video_files[self.current_index])
        filename = os.path.basename(self.current_video)
        
        # Open video
        self.cap = cv2.VideoCapture(self.current_video)
        if not self.cap.isOpened():
            self.status_var.set(f"Error opening video: {filename}")
            return
        
        # Read first frame
        ret, frame = self.cap.read()
        if ret:
            # Check if we have saved crop settings for this video
            if filename in self.video_crop_settings:
                # Use saved crop settings
                settings = self.video_crop_settings[filename]
                self.crop_x = settings['x']
                self.crop_y = settings['y']
                self.crop_width = settings['width']
                self.crop_height = settings['height']
            else:
                # Set default crop to full frame
                height, width = frame.shape[:2]
                self.crop_x = 0
                self.crop_y = 0
                self.crop_width = width
                self.crop_height = height
            
            # Show frame
            self.show_frame(frame)
            
            # Update crop info
            self.update_crop_info()
            
            # Select in listbox
            self.file_listbox.selection_clear(0, tk.END)
            self.file_listbox.selection_set(self.current_index)
            self.file_listbox.see(self.current_index)
            
            self.status_var.set(f"Loaded: {self.video_files[self.current_index]} ({width}x{height})")
        else:
            self.status_var.set(f"Error reading video: {self.video_files[self.current_index]}")
    
    def show_frame(self, frame):
        # Convert to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Store frame
        self.frame = frame_rgb
        
        # Resize to fit canvas
        height, width = frame_rgb.shape[:2]
        canvas_width = self.canvas.winfo_width()
        canvas_height = self.canvas.winfo_height()
        
        # Make sure canvas has been drawn
        if canvas_width <= 1:
            canvas_width = 640
        if canvas_height <= 1:
            canvas_height = 360
        
        # Calculate aspect ratio
        aspect = width / height
        
        if canvas_width / canvas_height > aspect:
            # Canvas is wider
            new_height = canvas_height
            new_width = int(new_height * aspect)
        else:
            # Canvas is taller
            new_width = canvas_width
            new_height = int(new_width / aspect)
        
        # Store scale factors
        self.scale_x = width / new_width
        self.scale_y = height / new_height
        
        # Resize
        frame_resized = cv2.resize(frame_rgb, (new_width, new_height))
        
        # Convert to PhotoImage
        self.photo = ImageTk.PhotoImage(image=Image.fromarray(frame_resized))
        
        # Display
        self.canvas.config(width=new_width, height=new_height)
        self.canvas.delete("all")
        self.canvas.create_image(0, 0, anchor=tk.NW, image=self.photo)
        
        # Draw crop rectangle
        self.draw_crop_rectangle()
    
    def on_file_select(self, event):
        selection = self.file_listbox.curselection()
        if selection:
            self.current_index = selection[0]
            self.load_current_video()
    
    def prev_video(self):
        if self.current_index > 0:
            self.current_index -= 1
            self.load_current_video()
    
    def next_video(self):
        if self.current_index < len(self.video_files) - 1:
            self.current_index += 1
            self.load_current_video()
    
    def on_mouse_down(self, event):
        # Get canvas coordinates
        x = event.x
        y = event.y
        
        # Check if we're on a resize handle or inside the crop box
        resize_mode = self.get_resize_mode(x, y)
        
        if resize_mode:
            # We're starting a resize operation
            self.resize_mode = resize_mode
            self.resize_start_x = x
            self.resize_start_y = y
            self.resize_start_crop_x = self.crop_x
            self.resize_start_crop_y = self.crop_y
            self.resize_start_width = self.crop_width
            self.resize_start_height = self.crop_height
        else:
            # We're starting a new crop
            self.resize_mode = None
            self.start_x = x
            self.start_y = y
            
            # Convert to video coordinates
            self.crop_x = int(x * self.scale_x)
            self.crop_y = int(y * self.scale_y)
            self.crop_width = 0
            self.crop_height = 0
        
        # Draw initial rectangle
        self.draw_crop_rectangle()
    
    def on_mouse_drag(self, event):
        # Get canvas coordinates
        x = event.x
        y = event.y
        
        if self.resize_mode:
            # We're resizing an existing crop box
            dx = x - self.resize_start_x
            dy = y - self.resize_start_y
            
            # Convert to video coordinates
            dx_video = int(dx * self.scale_x)
            dy_video = int(dy * self.scale_y)
            
            # Apply resize based on mode
            if 'move' in self.resize_mode:
                # Moving the entire box
                self.crop_x = self.resize_start_crop_x + dx_video
                self.crop_y = self.resize_start_crop_y + dy_video
            else:
                # Resizing the box
                if 'left' in self.resize_mode:
                    new_x = self.resize_start_crop_x + dx_video
                    new_width = self.resize_start_width - dx_video
                    if new_width > 10:  # Minimum size
                        self.crop_x = new_x
                        self.crop_width = new_width
                
                if 'right' in self.resize_mode:
                    new_width = self.resize_start_width + dx_video
                    if new_width > 10:  # Minimum size
                        self.crop_width = new_width
                
                if 'top' in self.resize_mode:
                    new_y = self.resize_start_crop_y + dy_video
                    new_height = self.resize_start_height - dy_video
                    if new_height > 10:  # Minimum size
                        self.crop_y = new_y
                        self.crop_height = new_height
                
                if 'bottom' in self.resize_mode:
                    new_height = self.resize_start_height + dy_video
                    if new_height > 10:  # Minimum size
                        self.crop_height = new_height
        else:
            # We're creating a new crop box
            # Calculate width and height in canvas coordinates
            width = max(10, event.x - self.start_x)  # Minimum size
            height = max(10, event.y - self.start_y)  # Minimum size
            
            # Convert to video coordinates
            self.crop_width = int(width * self.scale_x)
            self.crop_height = int(height * self.scale_y)
        
        # Update rectangle
        self.draw_crop_rectangle()
        
        # Update info
        self.update_crop_info()
    
    def on_mouse_up(self, event):
        # Final update
        self.on_mouse_drag(event)
        
        # Reset resize mode
        self.resize_mode = None
        
    def on_mouse_move(self, event):
        # Change cursor based on position
        resize_mode = self.get_resize_mode(event.x, event.y)
        
        if resize_mode == 'move':
            self.canvas.config(cursor="fleur")  # Move cursor
        elif resize_mode in ['left', 'right']:
            self.canvas.config(cursor="sb_h_double_arrow")  # Horizontal resize
        elif resize_mode in ['top', 'bottom']:
            self.canvas.config(cursor="sb_v_double_arrow")  # Vertical resize
        elif resize_mode in ['topleft', 'bottomright']:
            self.canvas.config(cursor="size_nw_se")  # Diagonal resize
        elif resize_mode in ['topright', 'bottomleft']:
            self.canvas.config(cursor="size_ne_sw")  # Diagonal resize
        else:
            self.canvas.config(cursor="")
    
    def get_resize_mode(self, x, y):
        """Determine if we're on a resize handle or inside the crop box"""
        if not self.crop_width or not self.crop_height:
            return None
            
        # Convert video coordinates to canvas coordinates
        crop_x = int(self.crop_x / self.scale_x)
        crop_y = int(self.crop_y / self.scale_y)
        crop_width = int(self.crop_width / self.scale_x)
        crop_height = int(self.crop_height / self.scale_y)
        
        # Edge detection margin
        margin = 8
        
        # Check if we're on the edges
        on_left = abs(x - crop_x) < margin
        on_right = abs(x - (crop_x + crop_width)) < margin
        on_top = abs(y - crop_y) < margin
        on_bottom = abs(y - (crop_y + crop_height)) < margin
        
        # Check corners first (they take priority)
        if on_top and on_left:
            return 'topleft'
        if on_top and on_right:
            return 'topright'
        if on_bottom and on_left:
            return 'bottomleft'
        if on_bottom and on_right:
            return 'bottomright'
        
        # Then check edges
        if on_left:
            return 'left'
        if on_right:
            return 'right'
        if on_top:
            return 'top'
        if on_bottom:
            return 'bottom'
        
        # Check if we're inside the crop box
        if (crop_x < x < crop_x + crop_width) and (crop_y < y < crop_y + crop_height):
            return 'move'
        
        # Not on any handle or inside
        return None
    
    def draw_crop_rectangle(self):
        # Convert video coordinates to canvas coordinates
        x = int(self.crop_x / self.scale_x)
        y = int(self.crop_y / self.scale_y)
        width = int(self.crop_width / self.scale_x)
        height = int(self.crop_height / self.scale_y)
        
        # Draw rectangle with modern styling
        self.canvas.delete("crop")
        
        # Main rectangle
        self.canvas.create_rectangle(
            x, y, x + width, y + height,
            outline="#3498db", width=2, tags="crop"
        )
        
        # Semi-transparent overlay for better visibility
        self.canvas.create_rectangle(
            x, y, x + width, y + height,
            fill="#3498db", stipple="gray25", tags="crop"
        )
        
        # Corner handles
        handle_size = 8
        handle_color = "#e74c3c"  # Red color for handles
        
        # Draw handles at corners
        corners = [
            (x, y, "topleft"),  # Top-left
            (x + width, y, "topright"),  # Top-right
            (x, y + height, "bottomleft"),  # Bottom-left
            (x + width, y + height, "bottomright")  # Bottom-right
        ]
        
        for cx, cy, corner_type in corners:
            self.canvas.create_rectangle(
                cx - handle_size//2, cy - handle_size//2,
                cx + handle_size//2, cy + handle_size//2,
                fill=handle_color, outline="white", tags=("crop", f"handle_{corner_type}")
            )
        
        # Edge handles (middle of each side)
        edge_handles = [
            (x + width//2, y, "top"),  # Top
            (x + width//2, y + height, "bottom"),  # Bottom
            (x, y + height//2, "left"),  # Left
            (x + width, y + height//2, "right")  # Right
        ]
        
        for cx, cy, edge_type in edge_handles:
            self.canvas.create_rectangle(
                cx - handle_size//2, cy - handle_size//2,
                cx + handle_size//2, cy + handle_size//2,
                fill="#f39c12", outline="white", tags=("crop", f"handle_{edge_type}")
            )
    
    def update_crop_info(self):
        self.crop_info.set(
            f"Crop: x={self.crop_x}, y={self.crop_y}, width={self.crop_width}, height={self.crop_height} | Aspect Ratio: {self.get_aspect_ratio()}"
        )
        
        # Save crop settings for current video
        if self.current_video:
            filename = os.path.basename(self.current_video)
            
            # Check if this is a new crop setting
            is_new = filename not in self.video_crop_settings
            
            # Save the crop settings
            self.video_crop_settings[filename] = {
                'x': self.crop_x,
                'y': self.crop_y,
                'width': self.crop_width,
                'height': self.crop_height
            }
            
            # Update the listbox highlight if this is a new crop
            if is_new:
                # Find the index of the file in the listbox
                for i in range(self.file_listbox.size()):
                    if self.file_listbox.get(i) == filename:
                        self.file_listbox.itemconfig(i, {'bg': '#d6eaf8', 'fg': '#2c3e50'})
                        break
    
    def get_aspect_ratio(self):
        """Calculate and format the aspect ratio of the current crop"""
        if self.crop_height == 0:
            return "N/A"
            
        ratio = self.crop_width / self.crop_height
        
        # Check for common aspect ratios
        common_ratios = {
            16/9: "16:9",
            4/3: "4:3",
            1: "1:1",
            9/16: "9:16",
            3/4: "3:4"
        }
        
        # Check if ratio is close to a common ratio
        for r, name in common_ratios.items():
            if abs(ratio - r) < 0.1:
                return name
                
        # Otherwise return the numeric ratio
        return f"{ratio:.2f}"
        

    
    def reset_crop(self):
        if not self.frame is None:
            # Reset to full frame
            height, width = self.frame.shape[:2]
            self.crop_x = 0
            self.crop_y = 0
            self.crop_width = width
            self.crop_height = height
            
            # Update UI
            self.draw_crop_rectangle()
            self.update_crop_info()
    
    def crop_current(self):
        if not self.current_video or not self.output_folder:
            messagebox.showerror("Error", "No video selected or output folder not set")
            return
        
        # Create output folder
        os.makedirs(self.output_folder, exist_ok=True)
        
        # Get output path
        filename = os.path.basename(self.current_video)
        name, ext = os.path.splitext(filename)
        output_path = os.path.join(self.output_folder, f"{name}_cropped{ext}")
        
        # Save current crop settings for this video
        self.video_crop_settings[filename] = {
            'x': self.crop_x,
            'y': self.crop_y,
            'width': self.crop_width,
            'height': self.crop_height
        }
        
        # Start cropping in a thread
        thread = threading.Thread(
            target=self.process_crop,
            args=(self.current_video, output_path)
        )
        thread.daemon = True
        thread.start()
        
        self.status_var.set(f"Cropping: {filename}...")
    
    def crop_all(self):
        if not self.video_files or not self.output_folder:
            messagebox.showerror("Error", "No videos loaded or output folder not set")
            return
        
        # Create output folder
        os.makedirs(self.output_folder, exist_ok=True)
        
        # Start cropping in a thread
        thread = threading.Thread(target=self.process_all_crops)
        thread.daemon = True
        thread.start()
        
        self.status_var.set("Cropping all videos...")
    
    def process_crop(self, input_path, output_path):
        try:
            # Check if ffmpeg is available
            try:
                subprocess.run(["ffmpeg", "-version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
            except:
                self.root.after(0, lambda: messagebox.showerror("Error", "FFmpeg not found. Please install FFmpeg and make sure it's in your PATH."))
                return
            
            # Build command
            cmd = [
                "ffmpeg",
                "-i", input_path,
                "-filter:v", f"crop={self.crop_width}:{self.crop_height}:{self.crop_x}:{self.crop_y}",
                "-c:a", "copy",
                "-y",
                output_path
            ]
            
            # Run command
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            # Wait for completion
            stdout, stderr = process.communicate()
            
            if process.returncode == 0:
                # Add to cropped videos list
                filename = os.path.basename(input_path)
                if filename not in self.cropped_videos:
                    self.cropped_videos.append(filename)
                
                self.root.after(0, lambda: self.status_var.set(f"Saved to: {output_path}"))
                self.root.after(0, lambda: messagebox.showinfo("Success", f"Video cropped successfully: {output_path}"))
            else:
                error = stderr.decode()
                self.root.after(0, lambda: self.status_var.set("Error cropping video"))
                self.root.after(0, lambda: messagebox.showerror("Error", f"FFmpeg error: {error[:500]}..."))
        
        except Exception as e:
            self.root.after(0, lambda: self.status_var.set(f"Error: {str(e)}"))
            self.root.after(0, lambda: messagebox.showerror("Error", str(e)))
    
    def process_all_crops(self):
        total = len(self.video_files)
        success = 0
        failed = 0
        
        for i, filename in enumerate(self.video_files):
            # Update status
            self.root.after(0, lambda i=i, t=total: self.status_var.set(f"Cropping video {i+1}/{t}..."))
            
            # Get paths
            input_path = os.path.join(self.video_folder, filename)
            name, ext = os.path.splitext(filename)
            output_path = os.path.join(self.output_folder, f"{name}_cropped{ext}")
            
            # Save current crop settings for all videos
            self.video_crop_settings[filename] = {
                'x': self.crop_x,
                'y': self.crop_y,
                'width': self.crop_width,
                'height': self.crop_height
            }
            
            try:
                # Build command
                cmd = [
                    "ffmpeg",
                    "-i", input_path,
                    "-filter:v", f"crop={self.crop_width}:{self.crop_height}:{self.crop_x}:{self.crop_y}",
                    "-c:a", "copy",
                    "-y",
                    output_path
                ]
                
                # Run command
                process = subprocess.Popen(
                    cmd,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE
                )
                
                # Wait for completion
                stdout, stderr = process.communicate()
                
                if process.returncode == 0:
                    success += 1
                    # Add to cropped videos list
                    if filename not in self.cropped_videos:
                        self.cropped_videos.append(filename)
                else:
                    failed += 1
                    print(f"Error cropping {filename}: {stderr.decode()[:200]}")
            
            except Exception as e:
                failed += 1
                print(f"Error cropping {filename}: {str(e)}")
        
        # Final status
        self.root.after(0, lambda s=success, f=failed: self.status_var.set(f"Completed: {s} successful, {f} failed"))
        self.root.after(0, lambda s=success, f=failed, p=self.output_folder: 
                       messagebox.showinfo("Crop Complete", 
                                          f"Cropped {s} videos successfully, {f} failed.\nSaved to: {p}"))
    
    def export_cropped_videos(self):
        """Export only the videos that have crop settings defined"""
        if not self.video_crop_settings:
            messagebox.showinfo("No Crop Settings", "No videos have crop settings defined yet.")
            return
            
        # Use the output folder that's already set
        if not self.output_folder:
            messagebox.showerror("No Output Folder", "Please set an output folder first.")
            return
            
        # Create folder if it doesn't exist
        os.makedirs(self.output_folder, exist_ok=True)
        
        # Start export in a thread
        thread = threading.Thread(
            target=self.process_all_individual_crops,
            args=(self.output_folder,)
        )
        thread.daemon = True
        thread.start()
        
        self.status_var.set(f"Exporting {len(self.video_crop_settings)} videos with individual crop settings...")
    
    def process_all_individual_crops(self, export_folder):
        """Process all videos with their individual crop settings"""
        total = len(self.video_crop_settings)
        success = 0
        failed = 0
        
        # Show progress window
        progress_window = tk.Toplevel(self.root)
        progress_window.title("Export Progress")
        progress_window.geometry("400x150")
        progress_window.transient(self.root)  # Set as transient to main window
        progress_window.grab_set()  # Make modal
        
        # Center the window
        progress_window.update_idletasks()
        width = progress_window.winfo_width()
        height = progress_window.winfo_height()
        x = (progress_window.winfo_screenwidth() // 2) - (width // 2)
        y = (progress_window.winfo_screenheight() // 2) - (height // 2)
        progress_window.geometry(f"{width}x{height}+{x}+{y}")
        
        # Progress elements
        ttk.Label(progress_window, text="Exporting videos with individual crop settings...", 
                 font=("Segoe UI", 10)).pack(pady=(15, 10))
        
        progress_var = tk.DoubleVar()
        progress_bar = ttk.Progressbar(progress_window, variable=progress_var, maximum=total)
        progress_bar.pack(fill=tk.X, padx=20, pady=5)
        
        progress_text = tk.StringVar(value="Starting...")
        progress_label = ttk.Label(progress_window, textvariable=progress_text)
        progress_label.pack(pady=5)
        
        for i, (filename, crop_settings) in enumerate(self.video_crop_settings.items()):
            # Update status and progress
            progress_var.set(i)
            self.root.after(0, lambda i=i, t=total, f=filename: 
                           self.status_var.set(f"Cropping video {i+1}/{t}: {f}..."))
            self.root.after(0, lambda i=i, t=total, f=filename: 
                           progress_text.set(f"Processing {i+1}/{t}: {f}"))
            progress_window.update()
            
            # Get paths
            input_path = os.path.join(self.video_folder, filename)
            name, ext = os.path.splitext(filename)
            output_path = os.path.join(export_folder, f"{name}_cropped{ext}")
            
            try:
                # Get crop settings for this specific video
                crop_x = crop_settings['x']
                crop_y = crop_settings['y']
                crop_width = crop_settings['width']
                crop_height = crop_settings['height']
                
                # Build command with individual crop settings
                cmd = [
                    "ffmpeg",
                    "-i", input_path,
                    "-filter:v", f"crop={crop_width}:{crop_height}:{crop_x}:{crop_y}",
                    "-c:a", "copy",
                    "-y",
                    output_path
                ]
                
                # Run command
                process = subprocess.Popen(
                    cmd,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE
                )
                
                # Wait for completion
                stdout, stderr = process.communicate()
                
                if process.returncode == 0:
                    success += 1
                else:
                    failed += 1
                    print(f"Error cropping {filename}: {stderr.decode()[:200]}")
            
            except Exception as e:
                failed += 1
                print(f"Error cropping {filename}: {str(e)}")
        
        # Final status
        self.root.after(0, lambda s=success, f=failed: 
                       self.status_var.set(f"Export completed: {s} successful, {f} failed"))
        
        # Update progress window
        progress_var.set(total)
        progress_text.set(f"Completed: {success} successful, {failed} failed")
        
        # Add close button to progress window
        ttk.Button(progress_window, text="Close", 
                  command=progress_window.destroy).pack(pady=10)
        
        # Show completion message
        self.root.after(0, lambda s=success, f=failed, p=export_folder: 
                       messagebox.showinfo("Export Complete", 
                                          f"Exported {s} videos with individual crops successfully, {f} failed.\nSaved to: {p}"))

if __name__ == "__main__":
    root = tk.Tk()
    app = BulkVideoCropper(root)
    root.mainloop()
