import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { signIn } from 'aws-amplify/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'shared-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-in.component.html'
})
export class SignInComponent {
  email = '';
  password = '';
  private router = inject(Router);

  async onSignIn() {
    try {
      await signIn({ username: this.email, password: this.password });
      this.router.navigate(['/main-layout/home']);
    } catch (error) {
      console.error('Sign in error', error);
    }
  }
}
