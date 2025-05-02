import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Check for saved user in localStorage
    this.checkForSavedUser();
  }

  private checkForSavedUser(): void {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<User> {
    // Mock login - in a real app, this would make an API call
    const mockUser: User = {
      id: '1',
      email: email,
      displayName: 'Demo User',
      photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
      createdAt: new Date(),
      settings: {
        currency: 'USD',
        language: 'en',
        theme: 'light',
        notifications: true,
        defaultView: 'dashboard'
      }
    };

    // Simulate API delay
    return of(mockUser).pipe(
      delay(800),
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(email: string, password: string, displayName: string): Observable<User> {
    // Mock registration - in a real app, this would make an API call
    const mockUser: User = {
      id: '1',
      email: email,
      displayName: displayName,
      createdAt: new Date(),
      settings: {
        currency: 'USD',
        language: 'en',
        theme: 'light',
        notifications: true,
        defaultView: 'dashboard'
      }
    };

    // Simulate API delay
    return of(mockUser).pipe(
      delay(800),
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}