# Smart Wall Paint Visualizer 🎨

A full-stack MEAN application that allows users to upload photos of their rooms, select walls, and visualize different paint colors and designs in real-time before actually painting.

## 🚀 Features
- **User Authentication:** Secure JWT-based login and registration.
- **Image Upload:** Upload room photos securely (Multer).
- **Canvas Editor:** Interactive HTML5 Canvas to paint on walls.
- **Realistic Blending:** Uses Canvas `multiply` blend mode and opacity for realistic paint preview.
- **Save & Download:** Save designs to MongoDB and download the final painted image.
- **Admin Dashboard:** Role-based access control (RBAC) for admins to view all user uploads and activity.

## 💻 Tech Stack
- **Frontend:** Angular 15+, HTML5 Canvas, SCSS, TypeScript.
- **Backend:** Node.js, Express.js, JWT, Multer, Bcrypt.
- **Database:** MongoDB (Mongoose).

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-link>
cd smart-wall-paint-visualizer