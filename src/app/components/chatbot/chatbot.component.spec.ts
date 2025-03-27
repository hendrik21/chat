import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatbotComponent } from './chatbot.component';
import { FormsModule } from '@angular/forms';

describe('ChatbotComponent', () => {
  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotComponent, FormsModule], // Cambiamos a 'imports' porque es standalone
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotComponent); // Creamos la instancia de prueba
    component = fixture.componentInstance; // Capturamos la referencia del componente
    fixture.detectChanges(); // Disparamos la detección de cambios inicial
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar con una lista vacía de mensajes', () => {
    expect(component.messages).toEqual([]);
  });

  it('debería agregar un mensaje del usuario cuando se envía un mensaje', () => {
    component.userInput = 'Hola';
    component.sendMessage();

    expect(component.messages.length).toBe(1);
    expect(component.messages[0]).toEqual({ text: 'Hola', sender: 'user' });
  });

  it('debería limpiar el campo userInput después de enviar un mensaje', () => {
    component.userInput = 'Hola';
    component.sendMessage();

    expect(component.userInput).toBe('');
  });

  it('debería agregar un mensaje del bot después de enviar un mensaje válido', (done) => {
    spyOn(component, 'getBotResponse').and.returnValue('Respuesta del bot');
    component.userInput = 'Hola';
    component.sendMessage();

    setTimeout(() => {
      expect(component.messages.length).toBe(2);
      expect(component.messages[1]).toEqual({ text: 'Respuesta del bot', sender: 'bot' });
      done();
    }, 500);
  });

  it('debería llamar a animateMessage() cuando hay nuevos mensajes renderizados', () => {
    spyOn(component, 'animateMessage');
    component.userInput = 'Hola';
    component.sendMessage();

    fixture.detectChanges();
    const lastMessageIndex = component.messages.length - 1;
    expect(component.animateMessage).toHaveBeenCalledWith(
      jasmine.anything(),
      component.messages[lastMessageIndex].sender === 'user'
    );
  });
});
