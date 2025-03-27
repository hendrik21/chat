import { Component, ElementRef, QueryList, ViewChildren, AfterViewChecked } from '@angular/core';
import gsap from 'gsap';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf } from '@angular/common';

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
  userInput = '';

  /** Referencias a las burbujas añadidas al DOM */
  @ViewChildren('messageBubble', { read: ElementRef }) messageBubbles!: QueryList<ElementRef>;

  /** Variable para rastrear qué mensaje fue el último animado */
  private lastAnimatedIndex = -1;

  /**
   * Maneja el envío de mensajes por parte del usuario
   */
  sendMessage(): void {
    if (!this.userInput.trim()) {
      return; // No enviar si el input está vacío
    }

    // Agrega el mensaje del usuario al historial
    this.messages.push({ text: this.userInput, sender: 'user' });

    // Obtiene la respuesta del bot (simula un pequeño retraso)
    setTimeout(() => {
      // PASAMOS EXPLÍCITAMENTE EL ÚLTIMO MENSAJE DEL USUARIO
      const lastUserMessage = this.getLastUserMessage();
      if (lastUserMessage) {
        const botResponse = this.getBotResponse(lastUserMessage.text); // Enviar solo el texto del último mensaje

        // Agrega la respuesta del bot (si tiene una respuesta válida)
        if (botResponse) {
          this.messages.push({ text: botResponse, sender: 'bot' });
        }
      }
    }, 500);

    // Limpia el campo de texto
    this.userInput = '';
  }

  /**
   * Obtiene la respuesta lógica del bot basada en el texto del usuario
   */
  getBotResponse(userMessage: string): string | null {
    const messageLength = userMessage.replace(/\s+/g, '').length; // Longitud del mensaje sin espacios
    const randomNumber = Math.random(); // Genera un número aleatorio entre 0 y 1

    if (messageLength % 2 === 0 && randomNumber < 1 / 3) {
      return "I don’t think so";
    } else if (messageLength % 2 !== 0 && randomNumber < 1 / 3) {
      return "No problem";
    } else {
      return null; // No responder (caso default)
    }
  }

  /**
   * Observa los cambios en el DOM después de renderizar nuevos mensajes
   */
  ngAfterViewChecked(): void {
    const messageElements = this.messageBubbles.toArray(); // Referencia a los elementos del DOM
    const lastMessageIndex = messageElements.length - 1;

    // Evita reanimar un mensaje que ya se ha procesado
    if (this.lastAnimatedIndex < lastMessageIndex) {
      const lastMessage = messageElements[lastMessageIndex];
      const isUserMessage = this.messages[lastMessageIndex].sender === 'user';

      this.animateMessage(lastMessage.nativeElement, isUserMessage);
      this.lastAnimatedIndex = lastMessageIndex; // Actualiza el índice del último mensaje animado
    }
  }

  /**
   * Anima un nuevo mensaje al aparecer (usuario o bot)
   */
  animateMessage(element: HTMLElement, isUserMessage: boolean): void {
    gsap.from(element, {
      opacity: 0,
      x: isUserMessage ? 50 : -50, // Usuario desde la derecha, bot desde la izquierda
      duration: 0.5,
      ease: 'power3.out',
    });
  }

  /**
   * Obtiene el último mensaje enviado por el usuario desde el historial
   */
  private getLastUserMessage(): { text: string; sender: 'user' } | undefined {
    return this.messages.slice().reverse().find(msg => msg.sender === 'user') as { text: string; sender: 'user' } | undefined;
  }
}
