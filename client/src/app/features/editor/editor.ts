import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-editor',
  standalone: false,
  templateUrl: './editor.html',
  styleUrls: ['./editor.scss']
})
export class Editor implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  
  brushColor: string = '#ff0000';
  brushSize: number = 20;
  project: any = null; // Store project data

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngAfterViewInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    // 1. Fetch the project from backend
    this.http.get(`${environment.apiUrl}/projects/${id}`, { headers })
      .subscribe({
             next: (res: any) => {
        this.project = res;
        
        // Pass the string exactly as stored in the DB. The loader function handles the URL formatting.
        const imageUrl = this.project.paintedImage || this.project.originalImage;
        this.loadImageToCanvas(imageUrl);
      },
        error: (err) => {
          console.error(err);
          alert('Failed to load project!');
        }
      });
  }

    loadImageToCanvas(imageUrl: string) {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    // If it's a local image, prepend localhost. If it's Base64, use it directly.
    img.src = imageUrl.startsWith('data:image') ? imageUrl : 'http://localhost:5000' + imageUrl;
    
    img.onload = () => {
      const maxWidth = 1000;
      const scale = Math.min(maxWidth / img.width, 1);
      
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }

  changeColor(event: any) {
    this.brushColor = event.target.value;
  }

     startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    this.draw(event);
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) return;

    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    
    // 🎯 THE FIX: Calculate the scale ratio
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Multiply the mouse position by the scale ratio
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    this.ctx.beginPath();
    this.ctx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
    this.ctx.fillStyle = this.brushColor;
    
    this.ctx.globalAlpha = 0.6;
    this.ctx.globalCompositeOperation = 'multiply';
    
    this.ctx.fill();
  }           

  stopDrawing() {
    this.isDrawing = false;
  }

  downloadImage() {
    const canvas = this.canvasRef.nativeElement;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'my-painted-room.png';
    link.click();
  }
    clearCanvas() {
    const canvas = this.canvasRef.nativeElement;
    // Clear the canvas
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw the original image
    this.loadImageToCanvas('http://localhost:5000' + this.project.originalImage);
  }
    saveDesign() {
    const canvas = this.canvasRef.nativeElement;
    // Convert the canvas drawing to a Base64 string
    const paintedImageData = canvas.toDataURL('image/png');
    
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    // Send to backend
    this.http.put(`${environment.apiUrl}/projects/${this.project._id}`, 
      { paintedImage: paintedImageData }, 
      { headers }
    ).subscribe({
      next: (res) => {
        alert('Design saved successfully!');
      },
      error: (err) => {
        console.error(err);
        alert('Failed to save design.');
      }
    });
  }
}