import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-background">
      <div class="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-lg">
        <h2 class="text-3xl font-bold text-center text-foreground">Sign In</h2>
        <p class="text-center text-muted-foreground">Welcome to Protos Platform</p>
        <button class="btn btn-primary w-full">Sign In with Cognito</button>
      </div>
    </div>
  `
})
export class SignInComponent {}
