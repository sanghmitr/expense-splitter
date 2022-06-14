import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  gotologin() {
    localStorage.removeItem('Token');
    this.router.navigate(['/login']);
  }
}
