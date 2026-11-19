import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  selectedFile: File | null = null;
  uploadMessage: string = '';
  projects: any[] = []; // <-- To store the fetched images

  constructor(
    private authService: AuthService, 
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.fetchProjects();
  }

  fetchProjects() {
    const token = this.authService.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    
    this.http.get<any[]>(`${environment.apiUrl}/projects`, { headers })
      .subscribe({
        next: (res) => this.projects = res,
        error: (err) => console.error(err)
      });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      formData.append('title', 'My New Room');

      const token = this.authService.getToken();
      const headers = { Authorization: `Bearer ${token}` };

      this.http.post(`${environment.apiUrl}/projects/upload`, formData, { headers })
        .subscribe({
          next: (res) => {
            this.uploadMessage = 'Image uploaded successfully!';
            this.fetchProjects(); // <-- Refresh the gallery immediately after upload
            this.selectedFile = null; // clear the file input
          },
          error: (err) => {
            this.uploadMessage = 'Upload failed. Check console.';
            console.error(err);
          }
        });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}