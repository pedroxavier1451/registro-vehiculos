import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitted = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get lf() { return this.loginForm.controls; }

  async onSubmit(): Promise<void> {
    this.isSubmitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { username, password } = this.loginForm.value;

    try {
      const ok = await this.firebaseService.validarCredenciales(username, password);
      if (ok) {
        // Marcar sesión de administrador (sin token)
        sessionStorage.setItem('isAdmin', 'true');
        sessionStorage.setItem('adminUser', username);
        console.log('Usuario autenticado:', username);
        this.router.navigate(['/admin/panel']);
      } else {
        this.errorMessage = 'Credenciales inválidas';
      }
    } catch (e) {
      this.errorMessage = 'Error al validar credenciales';
    } finally {
      this.isLoading = false;
    }
  }

  
}
