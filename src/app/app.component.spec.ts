import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule, ChatbotComponent], // Cambiamos de 'declarations' a 'imports'
    }).compileComponents();
  });

  it('debería crear el componente', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('debería contener el componente Chatbot', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-chatbot')).not.toBeNull(); // Verifica la existencia del selector
  });
});
