import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ChatbotComponent} from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
