import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import {ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class Admin implements OnInit {
  projects: any[] = [];

  constructor(
    private http: HttpClient, 
    private authService: AuthService, 
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const token = this.authService.getToken();
    
    // If there is no token at all, kick them to login
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>(`${environment.apiUrl}/projects/admin/all`, { headers })
      .subscribe({
        next: (res) => {
          console.log('Fetched data:', res);
          this.projects = res;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Admin fetch error:', err);
          // If token is expired (401), log them out
          if (err.status === 401 || err.status === 403) {
            alert('Session expired or not an admin. Please log in again.');
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      });
  }
}