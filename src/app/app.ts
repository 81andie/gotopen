import { Component, signal, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { Navbar } from "./components/navbar/navbar";
import {  Mapa } from "./components/map/map";
import { Sidenav } from "./components/sidenav/sidenav";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Mapa, Sidenav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('GotOpen');

  ngOnInit(): void{
    initFlowbite()
  }
}
