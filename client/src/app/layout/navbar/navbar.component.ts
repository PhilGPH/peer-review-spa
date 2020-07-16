import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input()
  username: string;

  @Input()
  loggedIn: boolean;

  @Output()
  logout: EventEmitter<undefined> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  triggerLogout() {
    return this.logout.emit();
  }
}
