# 🎥 Hand-Controlled Interactive Particle System

A web-based interactive particle visualization that responds to real-time **hand gestures** using a webcam.  
This project combines **computer vision** and **3D graphics** to create an immersive, touch-free experience directly in the browser.

---
<img src="https://i.postimg.cc/fLb47zdv/Screenshot-2026-01-11-112811.png" width="400"/>

## 🚀 Project Overview

This project demonstrates how modern web technologies can be used to build **real-time interactive visual systems**.  
Users can control a dynamic particle field using simple hand movements detected via their webcam.

The application runs completely on the **client side** and requires **no backend**.

---

## ✨ Features

- 🎥 **Live Webcam Background**  
  Displays real-time camera feed behind the particle system.

- 🖐️ **Hand Gesture Control**  
  Uses hand tracking to move and manipulate particles without touching the screen.

- 🤏 **Pinch-to-Scale Interaction**  
  Pinching fingers expands or contracts the particle system.

- 🌈 **Dynamic Rainbow Particles**  
  Smooth, continuously changing colors for an engaging visual effect.

- ⚡ **Real-Time Performance**  
  Optimized rendering for smooth animation and fast response.

---

## 🧠 How It Works

1. **MediaPipe Hands** detects hand landmarks from the webcam in real time.
2. The **index finger position** controls particle movement.
3. The **distance between index finger and thumb** controls particle scaling.
4. **Three.js** renders thousands of particles efficiently using WebGL.
5. Color values are animated frame-by-frame to create a rainbow effect.

---

## 🛠️ Technologies Used

- **HTML5** – Structure
- **CSS3** – Styling and layout
- **JavaScript (ES6)** – Core logic
- **Three.js** – 3D rendering and particle system
- **MediaPipe Hands** – Real-time hand tracking
- **WebGL** – High-performance graphics rendering

---


