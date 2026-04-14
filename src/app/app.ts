import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indzd3J2bmJ1bm5idWlzeHRtcHRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjAxMTk2OCwiZXhwIjoyMDkxNTg3OTY4fQ.vbJg-_ZGjW_1OIbHVtRmcsIeShPYJv26XxRM73YZboA'; // Ersetze mit deinem echten API-Key

  protected readonly title = signal('teamCombTool');
  protected readonly items = signal([{Top: 'Aatrox', Jungle: 'Amumu', Mid: 'Anivia', ADC: 'Ashe', Support: 'Blitzcrank'}, {Top: 'Darius', Jungle: 'Elise', Mid: 'Fiora', ADC: 'Garen', Support: 'Leona'}]);

  ngOnInit() {
    this.fetchData();
  }

  // Beispiel für eine GET-Anfrage
  fetchData() {
    const headers = { 'apikey': this.apiKey, 'Accept-Profile': 'public' }; // API-Key und Profil im Header
    this.http.get('https://wswrvnbunnbuisxtmpts.supabase.co/rest/v1/teamCombs', { headers }).subscribe({
      next: (data) => {
        console.log('Daten erhalten:', data);
        // Hier kannst du die Daten verarbeiten, z.B. this.items.set(data);
      },
      error: (error) => {
        console.error('Fehler:', error);
      }
    });
  }

  // Beispiel für eine POST-Anfrage
  sendData(data: any) {
    this.http.post('https://api.example.com/data', data).subscribe({
      next: (response) => {
        console.log('Antwort:', response);
      },
      error: (error) => {
        console.error('Fehler:', error);
      }
    });
  }
}
