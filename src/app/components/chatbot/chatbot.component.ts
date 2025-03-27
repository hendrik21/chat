import { Component, ElementRef, QueryList, ViewChildren, AfterViewChecked } from '@angular/core';
import gsap from 'gsap';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  imports: [
    FormsModule,
    NgClass,
    NgForOf
  ],
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  /** Array con los mensajes del usuario y del bot */
  messages: { text: string, sender: 'user' | 'bot' }[] = [];
  userInput: string = '';

  /** Referencias a las burbujas añadidas al DOM */
  @ViewChildren('messageBubble', { read: ElementRef }) messageBubbles!: QueryList<ElementRef>;

  /** Variable para rastrear qué mensaje fue el último animado */
  private lastAnimatedIndex = -1;

  sendMessage(): void {
    if (!this.userInput.trim()) {
      return;
    }

    // Agregamos el mensaje del usuario
    this.messages.push({ text: this.userInput, sender: 'user' });

    // Obtenemos la respuesta del bot tras un breve retraso
    setTimeout(() => {
      const botResponse = this.getBotResponse(this.userInput);

      // Solo agrega el mensaje del bot si hay una respuesta válida
      if (botResponse) {
        this.messages.push({ text: botResponse, sender: 'bot' });
      }
    }, 500);

    // Limpia el campo de entrada
    this.userInput = '';
  }

  /** Genera la respuesta del bot con base en la lógica proporcionada */
  getBotResponse(userMessage: string): string | null {
    const messageLength = userMessage.replace(/\s+/g, '').length; // Longitud del mensaje sin espacios
    const randomNumber = Math.random();

    if (messageLength % 2 === 0 && randomNumber < 1 / 3) {
      return "I don’t think so";
    } else if (messageLength % 2 !== 0 && randomNumber < 1 / 3) {
      return "No problem";
    } else {
      // No responde en otros casos
      return null;
    }
  }

  /** Observa los cambios en el DOM tras el renderizado de nuevos mensajes */
  ngAfterViewChecked(): void {
    const messageElements = this.messageBubbles.toArray();
    const lastMessageIndex = messageElements.length - 1;

    // Asegúrate de que no volvamos a animar un mensaje ya procesado
    if (this.lastAnimatedIndex < lastMessageIndex) {
      const lastMessage = messageElements[lastMessageIndex];
      const isUserMessage = this.messages[lastMessageIndex].sender === 'user';

      this.animateMessage(lastMessage.nativeElement, isUserMessage);
      this.lastAnimatedIndex = lastMessageIndex; // Actualizar el índice del último mensaje animado
    }
  }

  /** Anima un único mensaje (usuario o bot) */
  animateMessage(element: HTMLElement, isUserMessage: boolean): void {
    gsap.from(element, {
      opacity: 0,
      x: isUserMessage ? 50 : -50, // Usuario desde la derecha, bot desde la izquierda
      duration: 0.5,
      ease: 'power3.out',
    });
  }
}
