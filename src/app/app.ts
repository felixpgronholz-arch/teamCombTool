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

type Position = 'Top' | 'Jgl' | 'Mid' | 'Bot' | 'Supp';

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
  public smallMode = signal(false);
  public editorMode = signal(false);
  public activeAdd = signal<{comboId: number, position: Position} | null>(null);
  public showAddComb = signal(false);

  ngOnInit() {
    this.fetchData();
  }

  toggleSmallMode() {
    this.smallMode.set(!this.smallMode());
  }

  toggleEditorMode() {
     this.editorMode.set(!this.editorMode());
     return
    const password = prompt('Passwort eingeben:');
    if (password === 'klaassuckt') {
      this.editorMode.set(!this.editorMode());
    } else {
      alert('Falsches Passwort!');
    }
  }

  showAddChamp(comboId: number, position: Position) {
    this.activeAdd.set({comboId, position});
  }

  addChamp(teamComb: TeamComb, position: Position, champ: string) {
    if (!champ.trim()) return;
    const updatedComb = { ...teamComb };
    updatedComb[position] = [...teamComb[position], champ];
    this.patchComb(teamComb.id, updatedComb);
    this.activeAdd.set(null);
  }

  removeChamp(teamComb: TeamComb, position: Position, index: number) {
    const updatedComb = { ...teamComb };
    updatedComb[position] = teamComb[position].filter((_, i) => i !== index);
    this.patchComb(teamComb.id, updatedComb);
  }

  deleteComb(teamComb: TeamComb) {
    if (!confirm(`Combo "${teamComb.name}" wirklich löschen?`)) return;
    const headers = { 'apikey': this.apiKey, 'Accept-Profile': 'public' };
    const url = `https://wswrvnbunnbuisxtmpts.supabase.co/rest/v1/teamCombs?id=eq.${teamComb.id}`;
    this.http.delete(url, { headers }).subscribe({
      next: () => {
        this.items.set(this.items().filter(item => item.id !== teamComb.id));
      },
      error: (error) => {
        console.error('Fehler beim Löschen:', error);
      }
    });
  }

  addNewComb(name: string) {
    if (!name.trim()) return;
    const newComb = {
      name: name.trim(),
      Top: [],
      Jgl: [],
      Mid: [],
      Bot: [],
      Supp: []
    };
    const headers = { 'apikey': this.apiKey, 'Accept-Profile': 'public', 'Content-Type': 'application/json' };
    const url = `https://wswrvnbunnbuisxtmpts.supabase.co/rest/v1/teamCombs`;
    this.http.post<TeamComb>(url, newComb, { headers }).subscribe({
      next: (response) => {
        // Neue Combo zur Liste hinzufügen
        this.items.set([...this.items(), response]);
        this.showAddComb.set(false);
      },
      error: (error) => {
        console.error('Fehler beim Hinzufügen:', error);
      }
    });
  }

  patchComb(id: number, updatedComb: TeamComb) {
    const headers = { 'apikey': this.apiKey, 'Accept-Profile': 'public', 'Content-Type': 'application/json' };
    const url = `https://wswrvnbunnbuisxtmpts.supabase.co/rest/v1/teamCombs?id=eq.${id}`;
    // Entferne id und andere nicht zu patchende Felder
    const { id: _, ...body } = updatedComb;
    this.http.patch(url, body, { headers }).subscribe({
      next: () => {
        // Aktualisiere die lokale Liste
        const current = this.items();
        const index = current.findIndex(c => c.id === id);
        if (index !== -1) {
          current[index] = updatedComb;
          this.items.set([...current]);
        }
      },
      error: (error) => {
        console.error('Fehler beim Patchen:', error);
      }
    });
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
        })).sort((a: any, b: any) => a.id - b.id);
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
