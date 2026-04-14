import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface TeamComb {
  id: number;
  name: string;
  Top: string[];
  Jgl: string[];
  Mid: string[];
  Bot: string[];
  Supp: string[];
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indzd3J2bmJ1bm5idWlzeHRtcHRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjAxMTk2OCwiZXhwIjoyMDkxNTg3OTY4fQ.vbJg-_ZGjW_1OIbHVtRmcsIeShPYJv26XxRM73YZboA'; // Ersetze mit deinem echten API-Key

  public items = signal<TeamComb[]>([]);

  ngOnInit() {
    this.fetchData();
  }

  // Beispiel für eine GET-Anfrage
  fetchData() {
    const headers = { 'apikey': this.apiKey, 'Accept-Profile': 'public' }; // API-Key und Profil im Header
    this.http.get('https://wswrvnbunnbuisxtmpts.supabase.co/rest/v1/teamCombs', { headers }).subscribe({
      next: (data: any) => {
        console.log('Daten erhalten:', data);
        // Konvertiere die Objekte (c1, c2, etc.) zu Arrays
        const convertedData = data.map((item: any) => ({
          ...item,
          Top: Object.values(item.Top || {}).filter(v => v),
          Jgl: Object.values(item.Jgl || {}).filter(v => v),
          Mid: Object.values(item.Mid || {}).filter(v => v),
          Bot: Object.values(item.Bot || {}).filter(v => v),
          Supp: Object.values(item.Supp || {}).filter(v => v)
        }));
        setTimeout(() => this.items.set(convertedData as TeamComb[]), 0); // Verzögerte Zuweisung, um Change Detection-Fehler zu vermeiden
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
